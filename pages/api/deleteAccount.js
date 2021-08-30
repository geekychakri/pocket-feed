import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

const bodyData = {
  client_id: process.env.AUTH0_CLIENT_ID,
  client_secret: process.env.AUTH0_CLIENT_SECRET,
  audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
  grant_type: "client_credentials",
};

export default withApiAuthRequired(async (req, res) => {
  const session = getSession(req, res);

  try {
    const response = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      }
    );
    const data = await response.json();

    const user = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${session?.user.sub}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );
    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
});
