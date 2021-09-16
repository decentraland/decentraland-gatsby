import API from "decentraland-gatsby/dist/utils/api/API"

const GATSBY_BASE_URL = process.env.GATSBY_BASE_URL || "/"

export default {
  home: () => API.url(GATSBY_BASE_URL, "/"),
}
