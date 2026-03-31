export const userLoginAndGetToken = async (request, { email, password }) => {
  const response = await request.post("auth/login", {
    data: { email, password },
  });
  const body = await response.json();

  if (!body.data?.accessToken) {
    throw new Error(
      `Login failed for ${email}: ${response.status()} - ${body.message || JSON.stringify(body)}`
    );
  }

  return body.data.accessToken;
};