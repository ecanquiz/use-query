import axios from 'axios'
import useQuery from "@/composables/useQuery";

const instance = axios.create({
  baseURL: 'http://localhost:8000/api'
});

export const getTasks = async () => {
  return await useQuery(instance, "/tasks")
}

export const getTask = async <T>(taskId: T) => {
  return await useQuery(instance, `/tasks/${taskId}`);
}

export const insertTask = async <T>(payload: T) => {
  return await useQuery(instance, `/tasks`, {method: 'post', data: payload});
}

export const updateTask = async <T,U>(taskId: T, payload: U) => {
  return await useQuery(instance, `/tasks/${taskId}`, {method: 'put', data: payload});
}

export const removeTask = async <T>(taskId: T) => {  
  return await useQuery(instance, `/tasks/${taskId}`, {method: 'delete'});
}
