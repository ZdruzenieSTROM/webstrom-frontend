import axios from 'axios'
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
  },
  getOne: async (resource, params) => {
    const {data} = await axios.get(`${apiUrl}/${resource}/${params.id}`)

    return {data}
  },
  getMany: async (resource, params) => {
    const data = await Promise.all(params.ids.map((id) => axios.get(`${apiUrl}/${resource}/${id}`)))

    return {data: data.map(({data}) => data)}
  },
  // TODO: ak budeme pouzivat tuto funkciu, upravime podla getList (pagination, sort, filter). uprimne este neviem, pri com sa pouziva
  getManyReference: async (resource, params) => {
    const query = {
      [params.target]: params.id,
    }
    const {data} = await axios.get(`${apiUrl}/${resource}/?${stringify(query)}`)

    return {
      data: data,
      total: data.length,
    }
  },
  update: async (resource, params) => {
    const {id, formData, ...input} = params.data

    // create/update problemu moze obsahovat obrazok a tym padom to musime poslat ako form data.
    // ked existuju formData, ktore sme do recordu pridali v `transform` v `MyEdit`, pouzijeme tie
    const body = formData ?? input

    const {data} = await axios.patch(`${apiUrl}/${resource}/${id}`, body)

    return {data}
  },
  updateMany: async (resource, params) => {
    const data = await Promise.all(params.ids.map((id) => axios.patch(`${apiUrl}/${resource}/${id}`, params.data)))

    return {data: data.map(({data}) => data)}
  },
  create: async (resource, params) => {
    const {formData, ...input} = params.data

    const body = formData ?? input

    const {data} = await axios.post(`${apiUrl}/${resource}`, body)

    return {data}
  },
  delete: async (resource, params) => {
    const {data} = await axios.delete(`${apiUrl}/${resource}/${params.id}`)

    return {data}
  },
  deleteMany: async (resource, params) => {
    const data = await Promise.all(params.ids.map((id) => axios.delete(`${apiUrl}/${resource}/${id}`)))

    return {data: data.map(({data}) => data.id)}
  },
}
