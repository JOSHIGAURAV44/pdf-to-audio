const API_URL = import.meta.env.VITE_API_URL ;

export async function generateAudio(file) {
  const formData = new FormData()
  formData.append('pdf', file)

  let response
  try {
    response = await fetch(API_URL, { method: 'POST', body: formData })
  } catch {
    throw new Error('Unable to reach the audio service. Make sure the Flask backend is running on port 5000.')
  }

  if (!response.ok) {
    let message = 'Something went wrong while creating your audio.'
    try {
      const data = await response.json()
      message = data.error || message
    } catch {
      // Preserve the useful fallback if the backend cannot provide JSON.
    }
    throw new Error(message)
  }

  return response.blob()
}
