import axios, {isAxiosError} from 'axios'
import {stringify} from 'querystring'
import {DataProvider, FilterPayload, /* PaginationPayload, */ SortPayload} from 'react-admin'

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
const parseError = (error: unknown) => {
  // povacsine matchuje `mutations.onError` v `_app.tsx`
  if (isAxiosError(error)) {
    const data = error.response?.data as unknown
    if (typeof data === 'object' && data) {
      const detail = 'detail' in data && data.detail
      if (typeof detail === 'string') return detail

      const nonFieldErrors = 'non_field_errors' in data && data.non_field_errors
      const nonFieldErrorsUnknown = Array.isArray(nonFieldErrors) ? (nonFieldErrors as unknown[]) : []
      const nonFieldErrorsJoined = nonFieldErrorsUnknown.every((e) => typeof e === 'string')
        ? nonFieldErrorsUnknown.join('\n')
        : ''
      if (nonFieldErrorsJoined) return nonFieldErrorsJoined
    }
  }

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
    } catch (e) {
      throw new Error(parseError(e))
    }
  },
  getOne: async (resource, params) => {
    try {
      const {data} = await axios.get(`${apiUrl}/${resource}/${params.id}`)
      return {data}
    } catch (e) {
      throw new Error(parseError(e))
    }
  },
  getMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => axios.get(`${apiUrl}/${resource}/${id}`)))
      return {data: data.map(({data}) => data)}
    } catch (e) {
      throw new Error(parseError(e))
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
    } catch (e) {
      throw new Error(parseError(e))
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
    } catch (e) {
      throw new Error(parseError(e))
    }
  },
  updateMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => axios.patch(`${apiUrl}/${resource}/${id}`, params.data)))
      return {data: data.map(({data}) => data)}
    } catch (e) {
      throw new Error(parseError(e))
    }
  },
  create: async (resource, params) => {
    const {formData, ...input} = params.data

    const body = formData ?? input

    try {
      const {data} = await axios.post(`${apiUrl}/${resource}`, body)
      return {data}
    } catch (e) {
      throw new Error(parseError(e))
    }
  },
  delete: async (resource, params) => {
    try {
      const {data} = await axios.delete(`${apiUrl}/${resource}/${params.id}`)
      return {data}
    } catch (e) {
      throw new Error(parseError(e))
    }
  },
  deleteMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => axios.delete(`${apiUrl}/${resource}/${id}`)))
      return {data: data.map(({data}) => data.id)}
    } catch (e) {
      throw new Error(parseError(e))
    }
  },
}
