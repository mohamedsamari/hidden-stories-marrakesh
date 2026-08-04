const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface SimpleEntity {
  id: string
  nameEn: string
  nameFr: string
  createdAt: string
}

export interface SimpleEntityInput {
  nameEn: string
  nameFr: string
}

export async function createSimpleEntity(
  token: string,
  resourcePath: string,
  data: SimpleEntityInput
): Promise<SimpleEntity> {
  const response = await fetch(`${API_BASE_URL}/admin/${resourcePath}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`Failed to create entity: ${response.status}`)
  return response.json()
}

export async function updateSimpleEntity(
  token: string,
  resourcePath: string,
  id: string,
  data: SimpleEntityInput
): Promise<SimpleEntity> {
  const response = await fetch(`${API_BASE_URL}/admin/${resourcePath}/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`Failed to update entity: ${response.status}`)
  return response.json()
}

export async function deleteSimpleEntity(token: string, resourcePath: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/${resourcePath}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(`Failed to delete entity: ${response.status}`)
}
