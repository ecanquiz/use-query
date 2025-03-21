<script setup lang="ts">
import { computed, reactive, onMounted, toRaw} from 'vue'
import { useRouter } from 'vue-router'
import * as Services from '@/services/'
import FormTask from '@/components/FormTask.vue'
import type { Task } from '@/types'

const props = defineProps<{
  id?: string
}>()

const router = useRouter()

type Message = { message: string }

const task = reactive({
  data: {} as Task | Message,
  errors: {} as Error,
  pending: false
})

const isRenderable = computed(
  ()=> (props.id && Object.keys(task.data).length > 0)
    || props.id===undefined
)

const getTask = async () => {
    task.pending = true
    const { response, errors, pending }  = await Services.getTask(props.id)
    task.data = response.value.data as unknown as Task
    task.errors = errors.value
    task.pending = pending.value
}

const submit = async (payload: Task) => {
    payload = toRaw(payload)
    task.pending = true
    if (props.id===undefined) {
        const { response, errors, pending }  = await Services.insertTask(payload)
        task.data = response.value.data as unknown as Message
        task.errors = errors.value
        task.pending = pending.value
        alert(task.data.message)
        router.push({name: 'index'})
    } else {
        const { response, errors, pending }  = await Services.updateTask(props.id, payload)
        task.data = response.value.data as unknown as Message
        task.errors = errors.value
        task.pending = pending.value
        alert(task.data.message)
        router.push({name: 'index'})
    }

}

/*const submit = (payload: Task) => {
  pending.value = true
  if (props.id===undefined) {
    Services.insertTask(payload)
      .then(response => {
        alert(response.data.message)
        router.push({name: 'index'})
      })
      .catch(error => console.log(error))
      .finally(() => pending.value = false)
  } else {      
    Services.updateTask(props.id, payload)
      .then(response => {
        alert(response.data.message)
        router.push({name: 'index'})
      })
      .catch(error => console.log(error))
      .finally(() => pending.value = false)
  }
}*/

onMounted(()=>{
  if (props.id)
    getTask();
})   
</script>

<template>
  <div class="container row col-md-6 mx-auto w-1/2">
    <h1 v-if="task.pending" class="text-2xl" align="center">Loading...</h1>
    <h1 v-else class="text-2xl" align="center">
      {{$props.id ? 'Editing' : 'Creating'}} Tast
    </h1>
    <FormTask v-if="isRenderable" :task="task.data" @submit='submit' />
  </div>
</template>
