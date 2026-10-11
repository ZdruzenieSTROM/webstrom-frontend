import {setupServer} from 'msw/node'

export const server = setupServer()

const unhandledRequests: string[] = []

// App code swallows some request failures (e.g. the auth probe treats any error as "signed out"),
// so a rejected promise alone would let a request to an unmocked endpoint pass unnoticed.
// Recording them here lets the global afterEach fail the test that made the request.
export const startServer = () =>
  server.listen({
    onUnhandledFrame: async ({frame, defaults}) => {
      unhandledRequests.push(await frame.getUnhandledMessage())
      defaults.error()
    },
  })

export const takeUnhandledRequests = () => unhandledRequests.splice(0)
