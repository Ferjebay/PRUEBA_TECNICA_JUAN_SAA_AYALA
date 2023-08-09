<script setup lang="ts">

    interface Props {valor?: number, color?: string, EvenOrOdd?: string }

    const props = defineProps<{resultado: Props }>()

</script>

<template>
    <div class="col-2" style="height: 120px;display: flex; align-items: center;">
        <div class="card mr-3" style="height: 120px; width: 80%;border: none;">
            <div class="card-header headerCard">
                {{ props.resultado.EvenOrOdd  }}
            </div>
            <div class="card-body celda" :class="props.resultado.color == 'red' ? 'red' : 'black'">
                {{ props.resultado.valor }}
            </div>
        </div>
    </div>
</template>


<style scoped>
.celda{
    font-size: 36px;
    text-align: center;
    padding-top: 29px;
    color: aliceblue;
    /* border-radius: 15px; */
}
.red{
    background-color: #c41616;
}
.black{
    background-color: #183327;
}
.headerCard{
    background-color: rgb(24, 24, 24);
    color: aliceblue;
    text-align: center;
    font-size: 23px;
}
</style>