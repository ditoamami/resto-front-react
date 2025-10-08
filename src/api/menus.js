// src/api/menus.js
import axiosClient from './axiosClient';

export const getMenus = async () => {
  const res = await axiosClient.get('/menus');
  return res.data;
};
