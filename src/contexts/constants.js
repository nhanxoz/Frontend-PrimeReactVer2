export const apiUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:1486"
    : "https://sleepy-inlet-56101.herokuapp.com/api";

export const LOCAL_STORAGE_TOKEN_NAME = ".AspNet.ApplicationCookie";

export const POSTS_LOADED_SUCCESS = 'POSTS_LOADED_SUCCESS'
export const POSTS_LOADED_FAIL = 'POSTS_LOADED_FAIL'
export const ADD_POST = 'ADD_POST'
export const DELETE_POST = 'DELETE_POST'
export const UPDATE_POST = 'UPDATE_POST'
export const FIND_POST = 'FIND_POST'
export const access_token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuaGFuIiwiaWF0IjoxNjU1MzAyNTAyLCJleHAiOjE2NTUzODg5MDJ9.U0uCk2MwEONm5np7RiRZLZ_QBa9hFUr24MxLm3O23l8YBZc9bGKh_NJzSMl9EWQASFC9sXqArNfezPOBEn1tQQ'

