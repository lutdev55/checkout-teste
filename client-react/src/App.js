import React, { useState, useEffect, useRef } from 'react'

import Invoice from '@plisio/react-invoice'
import '@plisio/react-invoice/dist/style.css'

import api, { getQueryVariable } from './utils/api'

const App = () => {
  let id = null

  const intervalFetch = useRef(null)
  const [preLoading, setPreLoading] = useState(() => true)
  const [invoice, setInvoice] = useState(() => ({}))

  const fetchData = async () => {
    try {
      const response = await api.get('/check-invoice.php',
        {
          params: {
            page: 'invoice',
            invoice_id: id
          }
        }
      )
      setInvoice((prevInvoice) => response.data || {})
    } catch (error) {
      console.log('Failed to fetch data.', error)
    }
  }

  const cancelFetch = () => {
    clearInterval(intervalFetch.current)
  }

  const init = async () => {
    id = getQueryVariable('invoice_id')

    setPreLoading((prevPreLoading) => true)

    if (!id) {
      setPreLoading((prevPreLoading) => false)
      console.error('No invoice_id param found.')
    } else {
      await fetchData()
      setPreLoading((prevPreLoading) => false)
      intervalFetch.current = setInterval(async () => {
        await fetchData()
      }, 15 * 1000)
    }
  }

  useEffect(() => {
    init()
    return function cleanup () {
      cancelFetch()
    }
  }, [])

  return (
    <Invoice
      preLoading={ preLoading }
      invoice={ invoice }
      cancelFetch={ cancelFetch }
    />
  )
}

export default App
