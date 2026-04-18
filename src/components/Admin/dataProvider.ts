import {stringify} from 'querystring'
import {DataProvider, FilterPayload, PaginationPayload, SortPayload} from 'react-admin'

import {apiAxios} from '@/api/apiAxios'

import {toHttpError} from './parseError'

const getFilterQuery = ({q, ...otherSearchParams}: FilterPayload) => ({
  ...otherSearchParams,
  search: q,
})
const getOrderingQuery = ({order, field}: SortPayload) => ({ordering: `${order === 'ASC' ? '' : '-'}${field}`})

const getPaginationQuery = ({page, perPage}: PaginationPayload) => ({
  offset: (page - 1) * perPage,
  limit: perPage,
})

// skopirovane a dost upravene z https://github.com/bmihelac/ra-data-django-rest-framework/blob/master/src/index.ts
export const dataProvider: DataProvider = {
  getList: async (resource, {filter, sort, pagination}) => {
    const query = {
      ...(filter ? getFilterQuery(filter) : {}),
      ...(sort ? getOrderingQuery(sort) : {}),
      ...(pagination ? getPaginationQuery(pagination) : {}),
    }
    const stringifiedQuery = stringify(query)

    try {
      // return type dat sa lisi podla toho, ci je pouzita pagination. aktualne predpokladame, ze pagination pouzita je.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const {data} = await apiAxios.get<{count: number; next: string | null; previous: string | null; results: any[]}>(
        `/${resource}${stringifiedQuery ? `/?${stringifiedQuery}` : ''}`,
      )

      const {count, next, previous, results} = data

      return {
        data: results,
        total: count,
        pageInfo: {
          hasNextPage: !!next,
          hasPreviousPage: !!previous,
        },
      }
    } catch (error) {
      throw toHttpError(error)
    }
  },
  getOne: async (resource, params) => {
    try {
      const {data} = await apiAxios.get(`/${resource}/${params.id}`)
      return {data}
    } catch (error) {
      throw toHttpError(error)
    }
  },
  getMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => apiAxios.get(`/${resource}/${id}`)))
      return {data: data.map(({data}) => data)}
    } catch (error) {
      throw toHttpError(error)
    }
  },
  // TODO: ak budeme pouzivat tuto funkciu, upravime podla getList (pagination, sort, filter). uprimne este neviem, pri com sa pouziva
  getManyReference: async (resource, params) => {
    const query = {
      [params.target]: params.id,
    }

    try {
      const {data} = await apiAxios.get(`/${resource}/?${stringify(query)}`)
      return {
        data: data,
        total: data.length,
      }
    } catch (error) {
      throw toHttpError(error)
    }
  },
  update: async (resource, params) => {
    const {id, formData, ...input} = params.data

    // create/update problemu moze obsahovat obrazok a tym padom to musime poslat ako form data.
    // ked existuju formData, ktore sme do recordu pridali v `transform` v `MyEdit`, pouzijeme tie
    const body = formData ?? input

    try {
      const {data} = await apiAxios.patch(`/${resource}/${id}`, body)
      return {data}
    } catch (error) {
      throw toHttpError(error)
    }
  },
  updateMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => apiAxios.patch(`/${resource}/${id}`, params.data)))
      return {data: data.map(({data}) => data)}
    } catch (error) {
      throw toHttpError(error)
    }
  },
  create: async (resource, params) => {
    const {formData, ...input} = params.data

    const body = formData ?? input

    try {
      const {data} = await apiAxios.post(`/${resource}`, body)
      return {data}
    } catch (error) {
      throw toHttpError(error)
    }
  },
  delete: async (resource, params) => {
    try {
      const {data} = await apiAxios.delete(`/${resource}/${params.id}`)
      return {data}
    } catch (error) {
      throw toHttpError(error)
    }
  },
  deleteMany: async (resource, params) => {
    try {
      const data = await Promise.all(params.ids.map((id) => apiAxios.delete(`/${resource}/${id}`)))
      return {data: data.map(({data}) => data.id)}
    } catch (error) {
      throw toHttpError(error)
    }
  },
}
