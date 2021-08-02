import {stringify} from 'querystring'
import {DataProvider, fetchUtils, Record as RARecord} from 'react-admin'
import {Cookies} from 'react-cookie'

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

const cookies = new Cookies()

const authFetchJson = (url: string, options?: Record<string, unknown>) => {
  const token = cookies.get('webstrom-token')
  const authOptions = token
    ? {
        user: {
          authenticated: true,
          token: 'Token ' + token,
        },
      }
    : {}
  return fetchUtils.fetchJson(url, Object.assign(authOptions, options))
}

const dynamicSort = (key: string, order: string) => {
  const orderValue = order === 'ASC' ? 1 : -1
  return (a: RARecord, b: RARecord) => {
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
    const {json} = await authFetchJson(`${apiUrl}/${resource}/?${stringify(query)}`)

    // client-side sort
    const {field, order} = params.sort
    json.sort(dynamicSort(field, order))

    // client-side pagination
    const {page, perPage} = params.pagination
    const pagedData = json.slice((page - 1) * perPage, page * perPage)

    return {
      data: pagedData,
      total: json.length,
    }
  },
  getOne: async (resource, params) => {
    const {json} = await authFetchJson(`${apiUrl}/${resource}/${params.id}/`)

    return {
      data: json,
    }
  },
  getMany: async (resource, params) => {
    const data = await Promise.all(params.ids.map((id) => authFetchJson(`${apiUrl}/${resource}/${id}/`)))

    return {
      data: data.map(({json}) => json),
    }
  },
  // TODO: ak budeme pouzivat tuto funkciu, upravime podla getList (pagination, sort, filter). uprimne este neviem, pri com sa pouziva
  getManyReference: async (resource, params) => {
    const query = {
      [params.target]: params.id,
    }
    const {json} = await authFetchJson(`${apiUrl}/${resource}/?${stringify(query)}`)

    return {
      data: json,
      total: json.length,
    }
  },
  update: async (resource, params) => {
    const {json} = await authFetchJson(`${apiUrl}/${resource}/${params.id}/`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    })

    return {data: json}
  },
  updateMany: async (resource, params) => {
    const data = await Promise.all(
      params.ids.map((id) =>
        authFetchJson(`${apiUrl}/${resource}/${id}/`, {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        }),
      ),
    )

    return {
      data: data.map(({json}) => json),
    }
  },
  create: async (resource, params) => {
    const {json} = await authFetchJson(`${apiUrl}/${resource}/`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    })

    return {
      data: json,
    }
  },
  delete: async (resource, params) => {
    const {json} = await authFetchJson(`${apiUrl}/${resource}/${params.id}/`, {
      method: 'DELETE',
    })

    return {
      data: json,
    }
  },
  deleteMany: async (resource, params) => {
    const data = await Promise.all(
      params.ids.map((id) =>
        authFetchJson(`${apiUrl}/${resource}/${id}/`, {
          method: 'DELETE',
        }),
      ),
    )

    return {
      data: data.map(({json}) => json.id),
    }
  },
}
