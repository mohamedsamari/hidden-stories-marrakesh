const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function uploadImage(token: string, file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${API_BASE_URL}/admin/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.status}`)
  }

  const data: { url: string } = await response.json()
  return data.url
}
