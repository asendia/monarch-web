import axios from 'axios';

export const generateHeaders = async function generateHeaders(netlifyIdentity) {
  const headers = { 'Content-Type': 'application/json' };
  if (netlifyIdentity && netlifyIdentity.currentUser()) {
    const token = await netlifyIdentity.currentUser().jwt();
    return { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
}

export const protractTestament = async function protractTestament(token, netlifyIdentity) {
  const headers = generateHeaders(netlifyIdentity);
  const res = await axios.get(
    `https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/protract?token=${token}`,
    { headers }
  );
  return res;
}
