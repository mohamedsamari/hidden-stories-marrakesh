import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Layout } from './components/Layout'
import { StoriesListPage } from './pages/StoriesListPage'
import { StoryFormPage } from './pages/StoryFormPage'
import { LocationsListPage } from './pages/LocationsListPage'
import { LocationFormPage } from './pages/LocationFormPage'
import { SimpleEntityListPage } from './pages/SimpleEntityListPage'
import { fetchCategories } from './services/categories'
import { fetchDynasties } from './services/dynasties'
import { fetchHistoricalPeriods } from './services/historical-periods'

function App() {
  const { isAuthenticated, isLoading, login } = useKindeAuth()

  if (isLoading) {
    return <p>Chargement...</p>
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Hidden Stories of Marrakesh — Backoffice</h1>
        <button onClick={() => login()}>Se connecter</button>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<StoriesListPage />} />
          <Route path="/stories/new" element={<StoryFormPage />} />
          <Route path="/stories/:id/edit" element={<StoryFormPage />} />
          <Route path="/locations" element={<LocationsListPage />} />
          <Route path="/locations/new" element={<LocationFormPage />} />
          <Route path="/locations/:id/edit" element={<LocationFormPage />} />
          <Route
            path="/categories"
            element={
              <SimpleEntityListPage
                title="Catégories"
                resourcePath="categories"
                fetchEntities={fetchCategories}
              />
            }
          />
          <Route
            path="/dynasties"
            element={
              <SimpleEntityListPage
                title="Dynasties"
                resourcePath="dynasties"
                fetchEntities={fetchDynasties}
              />
            }
          />
          <Route
            path="/historical-periods"
            element={
              <SimpleEntityListPage
                title="Périodes historiques"
                resourcePath="historical-periods"
                fetchEntities={fetchHistoricalPeriods}
              />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
