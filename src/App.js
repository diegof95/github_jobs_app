import React, {useState} from 'react'
import { Container } from 'react-bootstrap'
import Job from './Job'
import SearchForm from './SearchForm'
import useFetchJobs from './fetching'
//import './App.css'
import 'regenerator-runtime/runtime' // Temp fix to: ReferenceError: regeneratorRuntime is not defined

function App(props){

  const [params, setParams] = useState({})
  const [page, setPage] = useState(1)
  const { jobs, loading, error } = useFetchJobs(params, page)

  const handleParamChange = (event) => {
    const param = event.target.name
    const value = event.target.value
    setPage(1)
    setParams(prevParams => {
      return { ...prevParams, [param]: value }
    })
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">GitHub Jobs</h1>
      <SearchForm params={params} onParamChange={handleParamChange} />

      {loading && <h1>Loading...</h1>}
      {error && <h1>Error. Try Refreshing.</h1>}
      {jobs.map((job) => {
        return <Job key={job.id} job={job} />
      })}
    </Container>
  )
}

export default App