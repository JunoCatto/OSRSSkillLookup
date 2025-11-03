export async function handler(event) {
  const user = event.queryStringParameters.user;
  if (!user) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing user parameter" }),
    };
  }

  try {
    const response = await fetch(
      `https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=${user}`
    );

    if (!response.ok) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Player not found" }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
