import axios, {AxiosError, AxiosResponse} from 'axios'
import {stringify} from 'querystring'
import {DataProvider, FilterPayload, /* PaginationPayload, */ RaRecord, SortPayload} from 'react-admin'

const getFilterQuery = ({q, ...otherSearchParams}: FilterPayload) => ({
  ...otherSearchParams,
  search: q,
})
const getOrderingQuery = ({order, field}: SortPayload) => ({ordering: `${order === 'ASC' ? '' : '-'}${field}`})
// TODO: pagination podla BE
// const getPaginationQuery = ({page, perPage}: PaginationPayload) => ({
//   offset: page,
//   limit: perPage,
// })

/* field errors by mali byt zachytene uz FE validaciou, dumpujem do 'Nastala neznáma chyba' */
const parseError = (response: any) => {
  if (typeof response === 'undefined') return 'Nastala neznáma chyba'
  if (typeof response.detail !== 'undefined') return response.detail
  if (response.non_field_errors?.constructor.name === 'Array') return response.non_field_errors.join('\n')
  return 'Nastala neznáma chyba'
}

const apiUrl = '/api'

// skopirovane a dost upravene z https://github.com/bmihelac/ra-data-django-rest-framework/blob/master/src/index.ts
export const dataProvider: DataProvider = {
  getList: async (resource, {filter, sort, pagination}) => {
    const query = {
      ...(filter ? getFilterQuery(filter) : {}),
      ...(sort ? getOrderingQuery(sort) : {}),
      // TODO: pagination podla BE
      // ...getPaginationQuery(pagination),
    }
    const stringifiedQuery = stringify(query)

    try {
      const {data} = await axios.get<any[]>(`${apiUrl}/${resource}${stringifiedQuery ? `/?${stringifiedQuery}` : ''}`)

      // client-side pagination
      let pagedData = data
      if (pagination) {
        const {page, perPage} = pagination
        pagedData = data.slice((page - 1) * perPage, page * perPage)
      }

      return {
        data: pagedData,
        total: data.length,
      }
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
  getOne: async (resource, params) => {
    try {
      const {data} = await axios.get(`${apiUrl}/${resource}/${params.id}`)
      return {data}
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
  getMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => axios.get(`${apiUrl}/${resource}/${id}`)))
      return {data: data.map(({data}) => data)}
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
  // TODO: ak budeme pouzivat tuto funkciu, upravime podla getList (pagination, sort, filter). uprimne este neviem, pri com sa pouziva
  getManyReference: async (resource, params) => {
    const query = {
      [params.target]: params.id,
    }

    try {
      const {data} = await axios.get(`${apiUrl}/${resource}/?${stringify(query)}`)
      return {
        data: data,
        total: data.length,
      }
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
  update: async (resource, params) => {
    const {id, formData, ...input} = params.data

    // create/update problemu moze obsahovat obrazok a tym padom to musime poslat ako form data.
    // ked existuju formData, ktore sme do recordu pridali v `transform` v `MyEdit`, pouzijeme tie
    const body = formData ?? input

    try {
      const {data} = await axios.patch(`${apiUrl}/${resource}/${id}`, body)
      return {data}
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
  updateMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => axios.patch(`${apiUrl}/${resource}/${id}`, params.data)))
      return {data: data.map(({data}) => data)}
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
  create: async (resource, params) => {
    const {formData, ...input} = params.data

    const body = formData ?? input

    try {
      const {data} = await axios.post(`${apiUrl}/${resource}`, body)
      return {data}
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
  delete: async (resource, params) => {
    try {
      const {data} = await axios.delete(`${apiUrl}/${resource}/${params.id}`)
      return {data}
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
  deleteMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => axios.delete(`${apiUrl}/${resource}/${id}`)))
      return {data: data.map(({data}) => data.id)}
    } catch (e: any) {
      throw new Error(parseError(e.response.data))
    }
  },
}
