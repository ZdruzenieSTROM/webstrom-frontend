import axios from 'axios'
import {stringify} from 'querystring'
import {DataProvider, RaRecord} from 'react-admin'

// potencialne TODO: ak BE bude mat pagination, filter alebo sort, upravime a pouzijeme tento kod.
// zatial je pagination aj sort rieseny client-side a len pre getList, filter/search nemame.

// import {FilterPayload, PaginationPayload, SortPayload} from 'react-admin'

// const getPaginationQuery = ({page, perPage}: PaginationPayload) => ({
//   page,
//   page_size: perPage,
// })
// const getFilterQuery = ({q, ...otherSearchParams}: FilterPayload) => ({
//   ...otherSearchParams,
//   search: q,
// })
// const getOrderingQuery = ({field, order}: SortPayload) => ({
//   ordering: `${order === 'ASC' ? '' : '-'}${field}`,
// })

const dynamicSort = (key: string, order: string) => {
  const orderValue = order === 'ASC' ? 1 : -1
  return (a: RaRecord, b: RaRecord) => {
    if (a[key] > b[key]) return orderValue
    if (a[key] < b[key]) return -orderValue
    return 0
  }
}

const apiUrl = '/api'

// skopirovane a dost upravene z https://github.com/bmihelac/ra-data-django-rest-framework/blob/master/src/index.ts
export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const query = {
      // TODO: ked BE bude mat pagination, filter alebo sort
      // ...getFilterQuery(params.filter),
      // ...getPaginationQuery(params.pagination),
      // ...getOrderingQuery(params.sort),
    }
    const stringifiedQuery = stringify(query)
    const {data} = await axios.get(`${apiUrl}/${resource}${stringifiedQuery ? `/?${stringifiedQuery}` : ''}`)

    // client-side sort
    const {field, order} = params.sort

    data.sort(dynamicSort(field, order))

    // client-side pagination
    const {page, perPage} = params.pagination
    const pagedData = data.slice((page - 1) * perPage, page * perPage)

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
