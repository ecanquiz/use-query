import { ref } from 'vue'
// import { getError } from "@/helpers";

export default () => {
  const pending = ref(true)
  const errors = ref()
  const data = ref([])
  
  return {
    data,
    errors,
    pending
    //getError
  }
}

