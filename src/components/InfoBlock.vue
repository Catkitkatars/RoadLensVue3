<template>
  <div style="z-index: 1000" class="absolute top-4 left-10 rounded-lg overflow-auto">
    <div
        v-if="activePoint"
        style="width: 600px; max-height: 85vh; overflow: auto"
        class="
        px-2 py-4 pb-8 rounded-lg
    bg-slate-700 relative flex align-middle flex-col"
    >
      <div class="absolute bg-emerald-600 top-5 right-5 w-7 h-7 rounded-md flex justify-center items-center">
        <span
            class=" material-icons text-white cursor-pointer"
            @click="closeBlock">close
        </span>
      </div>
      <div class="px-2">
        <h2 class="text-center text-white px-4 py-5 font-bold text-xl"> {{ activePoint.properties.ulid }} </h2>
        <div class="relative border-solid border-2 border-emerald-600 my-8 rounded-lg p-2 pt-4">
          <p
              class="absolute -top-5 left-4 text-white bg-emerald-600 p-2 rounded-lg"
          >Характеристики</p>
          <p class="text-white my-2">Тип: <span> {{ typeList[activePoint.properties.type].label }} </span></p>
          <p class="text-white my-2">Модель: <span> {{ modelList[activePoint.properties.model].label }} </span></p>
        </div>
        <div class="relative border-solid border-2 border-emerald-600 my-8 rounded-lg p-2 pt-4 flex justify-around align-middle">
          <p
              class="absolute -top-5 left-4 text-white bg-emerald-600 p-2 rounded-lg"
          >Рейтинг</p>
          <div class="flex justify-center items-center">
            <span class="text-white my-2 material-icons cursor-pointer">
            thumb_up
          </span> <span class="text-white ml-2"> 1 </span>
          </div>
          <div class="flex justify-center items-center">
            <span class="text-white my-2 material-icons cursor-pointer">
            thumb_down
            </span> <span class="text-white ml-2"> 1 </span>
          </div>
        </div>

        <div class="relative border-solid border-2 border-emerald-600 my-8 rounded-lg p-2 pt-4 flex justify-around align-middle">
          <p
              class="absolute -top-5 left-4 text-white bg-emerald-600 p-2 rounded-lg"
          >Скорость</p>
          <div class="flex justify-center items-center">
            <span class="text-white my-2 material-icons cursor-pointer">
            directions_car
          </span> <span class="text-white ml-2 d-inline-block text-center"> {{ activePoint.properties.carSpeed }} </span>
          </div>
          <div class="flex justify-center items-center">
            <span class="text-white my-2 material-icons cursor-pointer">
            local_shipping
            </span> <span class="text-white ml-2"> {{ activePoint.properties.truckSpeed }} </span>
          </div>
        </div>
        <div
            :class="{ 'flexASC': activePoint.properties.ASC.previous && activePoint.properties.ASC.next }"
            v-if="activePoint.properties.isASC"
            class="relative border-solid border-2 border-emerald-600 my-8 rounded-lg p-2 pt-4 flex justify-around align-middle">
          <p
              class="absolute -top-5 left-4 text-white bg-emerald-600 p-2 rounded-lg"
          >Средняя скорость</p>
          <div class="flex justify-center items-center my-4">
            <p
                v-if="activePoint.properties.ASC.previous"
                class="text-white relative">| ____________________
              <span class="material-icons text-center absolute top-4 left-8">
                  trending_flat
              </span>
              <span class="material-icons text-center absolute top-4 left-32">
                  trending_flat
              </span>
              <span class="text-white my-2 material-icons cursor-pointer absolute -top-4 -left-2">
                videocam
              </span>
              <span
                  v-if="!activePoint.properties.ASC.next"
                  class="relative">|
                <span class="text-emerald-600 my-2 material-icons cursor-pointer absolute -top-5 -left-2">
                videocam
              </span>
              </span>
            </p>
            <p
                v-if="activePoint.properties.ASC.next"
                class="text-white relative">
              &nbsp| ____________________ |
              <span class="text-emerald-600 my-2 material-icons cursor-pointer absolute -top-4 -left-1">
                videocam
              </span>
              <span class="text-white my-2 material-icons cursor-pointer absolute -top-4 -right-3">
                videocam
              </span>
              <div class="text-sm flex justify-center items-center absolute -top-4 left-14">
                <span class="text-white my-2 material-icons cursor-pointer">
                speed
                </span>
                <span class="text-white ml-2 d-inline-block text-center"> {{ activePoint.properties.ASC.speed }} км/ч </span>
              </div>
              <span class="material-icons text-center absolute top-4 left-8">
                  trending_flat
              </span>
              <span class="material-icons text-center absolute top-4 left-32">
                  trending_flat
              </span>
            </p>
          </div>
          <div>
            <p v-if="activePoint.properties.ASC.previous" class="text-white my-2 text-sm cursor-pointer">Пред.: <span>{{ activePoint.properties.ASC.previous }}</span></p>
            <p v-if="activePoint.properties.ASC.next" class="text-white my-2 text-sm cursor-pointer">След.: <span>{{ activePoint.properties.ASC.next  }}</span></p>
            <p class="text-white my-2 text-sm">Ср. Скорость: <span>{{ activePoint.properties.ASC.speed }}</span></p>
          </div>

        </div>
        <div class="relative border-solid border-2 border-emerald-600 my-8 rounded-lg p-2 pt-4">
          <p
              class="absolute -top-5 left-4 text-white bg-emerald-600 p-2 rounded-lg"
          >Информация</p>
          <p class="text-white my-2">Статус: <span> {{ status[activePoint.properties.status].label }} </span></p>
          <p class="text-white my-2">Дата создания: <span>{{ activePoint.properties.dateCreate }}</span></p>
          <p class="text-white my-2">Дата обновления: <span>{{ activePoint.properties.lastUpdate }}</span></p>
          <p class="text-white my-2">Модератор: <span>{{ activePoint.properties.user }}</span></p>
        </div>
      </div>
      <div class="mx-4">
        <button @click="startEdit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
          Изменить
        </button>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import Select from "@/components/Select.vue";
import store from "@/store/store";

export default {
  components: {
    Select
  },
  data() {
    return {
      isEdited: false,
      countryNumber: null,
      region: null,
      ascBlockChecked: false,
      status:[
        { value: '1', label: 'Подтвержден' },
        { value: '2', label: 'Не подтвержден' },
        { value: '3', label: 'Удален' },
      ],
      typeList:[
        { value: '', label: '--Выберите тип--' },
        { value: '1', label: 'Безрадарный' },
        { value: '2', label: 'Радарный' },
        { value: '3', label: 'Видеоблок' },
        { value: '4', label: 'Контроль остановки' },
        { value: '5', label: 'Муляж' },
        { value: '6', label: 'Контроль светофора' },
        { value: '7', label: 'Мобильная камера' }
      ],
      modelList: [
        { value: '', label: '--Выберите модель--' },
        { value: '1', label: 'Кордон' },
        { value: '2', label: 'Арена' },
        { value: '3', label: 'Крис' },
        { value: '4', label: 'Скат' },
        { value: '7', label: 'Интегра-КДД' },
        { value: '6', label: 'Мангуст' },
        { value: '8', label: 'Азимут' },
      ],
      flagsList: [
        { value: '1', label: 'В спину' },
        { value: '2', label: 'Разметка' },
        { value: '3', label: 'Пешеходный' },
        { value: '4', label: 'Обочина' },
        { value: '5', label: 'Автобусная' },
        { value: '6', label: 'Контроль остановки' },
        { value: '7', label: 'Грузовой контроль' },
        { value: '8', label: 'Ремень/Телефон' },
      ],
      countrysList: [
        { value: '', label: '--Выберите страну--' },
        { value: '1', label: 'Россия'},
        { value: '2', label: 'Беларусь'},
        { value: '3', label: 'Казахстан'},
        { value: '4', label: 'Узбекистан'},
      ],
      regionsList: [
          [
        { value: '', label: '--Выберите регион--' },
        { value: '1', label: '1 Республика Адыгея (Адыгея)' },
        { value: '2', label: '2 Республика Башкортостан' },
        { value: '3', label: '3 Республика Бурятия' },
        { value: '4', label: '4 Республика Алтай' },
        { value: '5', label: '5 Республика Дагестан' },
        { value: '6', label: '6 Республика Ингушетия' },
        { value: '7', label: '7 Кабардино-Балкарская Республика' },
        { value: '8', label: '8 Республика Калмыкия' },
        { value: '9', label: '9 Карачаево-Черкесская Республика' },
        { value: '10', label: '10 Республика Карелия' },
        { value: '11', label: '11 Республика Коми' },
        { value: '12', label: '12 Республика Марий Эл' },
        { value: '13', label: '13 Республика Мордовия' },
        { value: '14', label: '14 Республика Саха (Якутия)' },
        { value: '15', label: '15 Республика Северная Осетия - Алания' },
        { value: '16', label: '16 Республика Татарстан (Татарстан)' },
        { value: '17', label: '17 Республика Тыва' },
        { value: '18', label: '18 Удмуртская Республика' },
        { value: '19', label: '19 Республика Хакасия' },
        { value: '20', label: '20 Чеченская Республика' },
        { value: '21', label: '21 Чувашская Республика - Чувашия' },
        { value: '22', label: '22 Алтайский край' },
        { value: '23', label: '23 Краснодарский край' },
        { value: '24', label: '24 Красноярский край' },
        { value: '25', label: '25 Приморский край' },
        { value: '26', label: '26 Ставропольский край' },
        { value: '27', label: '27 Хабаровский край' },
        { value: '28', label: '28 Амурская область' },
        { value: '29', label: '29 Архангельская область' },
        { value: '30', label: '30 Астраханская область' },
        { value: '31', label: '31 Белгородская область' },
        { value: '32', label: '32 Брянская область' },
        { value: '33', label: '33 Владимирская область' },
        { value: '34', label: '34 Волгоградская область' },
        { value: '35', label: '35 Вологодская область' },
        { value: '36', label: '36 Воронежская область' },
        { value: '37', label: '37 Ивановская область' },
        { value: '38', label: '38 Иркутская область' },
        { value: '39', label: '39 Калининградская область' },
        { value: '40', label: '40 Калужская область' },
        { value: '41', label: '41 Камчатский край' },
        { value: '42', label: '42 Кемеровская область' },
        { value: '43', label: '43 Кировская область' },
        { value: '44', label: '44 Костромская область' },
        { value: '45', label: '45 Курганская область' },
        { value: '46', label: '46 Курская область' },
        { value: '47', label: '47 Ленинградская область' },
        { value: '48', label: '48 Липецкая область' },
        { value: '49', label: '49 Магаданская область' },
        { value: '50', label: '50 Московская область' },
        { value: '51', label: '51 Мурманская область' },
        { value: '52', label: '52 Нижегородская область' },
        { value: '53', label: '53 Новгородская область' },
        { value: '54', label: '54 Новосибирская область' },
        { value: '55', label: '55 Омская область' },
        { value: '56', label: '56 Оренбургская область' },
        { value: '57', label: '57 Орловская область' },
        { value: '58', label: '58 Пензенская область' },
        { value: '59', label: '59 Пермский край' },
        { value: '60', label: '60 Псковская область' },
        { value: '61', label: '61 Ростовская область' },
        { value: '62', label: '62 Рязанская область' },
        { value: '63', label: '63 Самарская область' },
        { value: '64', label: '64 Саратовская область' },
        { value: '65', label: '65 Сахалинская область' },
        { value: '66', label: '66 Свердловская область' },
        { value: '67', label: '67 Смоленская область' },
        { value: '68', label: '68 Тамбовская область' },
        { value: '69', label: '69 Тверская область' },
        { value: '70', label: '70 Томская область' },
        { value: '71', label: '71 Тульская область' },
        { value: '72', label: '72 Тюменская область' },
        { value: '73', label: '73 Ульяновская область' },
        { value: '74', label: '74 Челябинская область' },
        { value: '75', label: '75 Забайкальский край' },
        { value: '76', label: '76 Ярославская область' },
        { value: '77', label: '77 Москва' },
        { value: '78', label: '78 Санкт-Петербург' },
        { value: '79', label: '79 Еврейская автономная область' },
        { value: '80', label: '80 Чукотский автономный округ' },
        { value: '81', label: '81 Ненецкий автономный округ' },
        { value: '82', label: '82 Ханты-Мансийский автономный округ - Югра' },
        { value: '83', label: '83 Ямало-Ненецкий автономный округ' },
        { value: '84', label: '84 Республика Крым' },
        { value: '85', label: '85 Севастополь' }
      ],
      [
          { value: '', label: '--Выберите регион--' },
    { value: '1', label: '1 Брестская область' },
    { value: '2', label: '2 Витебская область' },
    { value: '3', label: '3 Гомельская область' },
    { value: '4', label: '4 Гродненская область' },
    { value: '5', label: '5 Минская область' },
    { value: '6', label: '6 Могилёвская область' },
    { value: '7', label: '7 г. Минск' }
  ],
    [
      { value: '', label: '--Выберите регион--' },
      { value: '1', label: '1 Акмолинская область' },
      { value: '2', label: '2 Актюбинская область' },
      { value: '3', label: '3 Алматинская область' },
      { value: '4', label: '4 Атырауская область' },
      { value: '5', label: '5 Восточно-Казахстанская область' },
      { value: '6', label: '6 Жамбылская область' },
      { value: '7', label: '7 Западно-Казахстанская область' },
      { value: '8', label: '8 Карагандинская область' },
      { value: '9', label: '9 Костанайская область' },
      { value: '10', label: '10 Кызылординская область' },
      { value: '11', label: '11 Мангистауская область' },
      { value: '12', label: '12 Павлодарская область' },
      { value: '13', label: '13 Северо-Казахстанская область' },
      { value: '14', label: '14 Туркестанская область' },
      { value: '15', label: '15 г. Алматы' },
      { value: '16', label: '16 г. Нур-Султан (Астана)' }
    ],
        [
          { value: '', label: '--Выберите регион--' },
          { value: '1', label: '1 Андижанская область' },
          { value: '2', label: '2 Бухарская область' },
          { value: '3', label: '3 Джизакская область' },
          { value: '4', label: '4 Кашкадарьинская область' },
          { value: '5', label: '5 Навоийская область' },
          { value: '6', label: '6 Наманганская область' },
          { value: '7', label: '7 Республика Каракалпакстан' },
          { value: '8', label: '8 Самаркандская область' },
          { value: '9', label: '9 Сурхандарьинская область' },
          { value: '10', label: '10 Сырдарьинская область' },
          { value: '11', label: '11 Ташкентская область' },
          { value: '12', label: '12 Ферганская область' },
          { value: '13', label: '13 Хорезмская область' },
          { value: '14', label: '14 г. Ташкент' }
        ]
      ]
    }
  },
  computed: {
    activePoint()  {
      return store.getters.activePoint;
    }
  },
  methods: {
    closeBlock() {
      this.activePoint.isActive = false;
      this.activePoint.changeColorClick();
      this.activePoint.changeColorMouseOverOut();
      this.$store.dispatch('setActivePoint', null);

      const params = this.$route.params;
      this.$router.push({ name: 'Home', params: {
                                              lat: params.lat,
                                              lng: params.lng,
                                              zoom: params.zoom,
      } })
    },
    startEdit() {
      this.activePoint.isActive = false;
      this.activePoint.isEdited = true;

      this.$router.push({ name: 'EditBlock', params: { id: this.activePoint.properties.ulid } })
    },
  },
}


</script>

<style>
.flexASC {
  display: flex;
  flex-direction: column;
}
.visible {
  display: block;
}
</style>