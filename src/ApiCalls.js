export const generateHeaders = async function generateHeaders(netlifyIdentity) {
  const headers = { 'Content-Type': 'application/json' };
  if (netlifyIdentity && netlifyIdentity.currentUser()) {
    const token = await netlifyIdentity.currentUser().jwt();
    return { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
}
