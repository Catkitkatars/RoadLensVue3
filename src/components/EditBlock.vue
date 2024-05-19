<template>
  <div style="z-index: 1000" class="absolute top-4 left-10 rounded-lg overflow-auto">
    <form
      style="width: 600px; max-height: 85vh; overflow: auto"
      class="
        px-4 py-4 pb-4 rounded-lg
        bg-slate-700 p-4"
  >
    <div class="absolute bg-emerald-600 top-5 right-5 w-7 h-7 rounded-md flex justify-center items-center z-10 shadow-xl shadow-slate-700">
        <span
            class=" material-icons text-white cursor-pointer"
            @click="closeBlock">close
        </span>
    </div>
    <div
        v-if="activePoint.properties.ulid"
        class="absolute bg-emerald-600 top-5 left-4 w-7 h-7 rounded-md flex justify-center items-center z-10 shadow-xl shadow-slate-700">
        <span
            class=" material-icons text-white cursor-pointer"
            @click="backEditBlock">
          arrow_back
        </span>
    </div>

    <h2 v-if="activePoint.properties.ulid" class="text-white text-center text-2xl">
      Редактирование
      <span>{{ activePoint.properties.ulid }}</span>
    </h2>
    <p v-if="activePoint.properties.isDeleted === 0" class="text-green-500 text-center">Действующая</p>
    <p v-if="activePoint.properties.isDeleted === 1" class="text-red-500">Удалена</p>
    <h2 v-if="!activePoint.properties.ulid" class="text-white text-center text-2xl"> Создание </h2>


    <div class="relative border-solid border-2 border-emerald-600 my-8 rounded-lg p-2 pt-4">
      <p
          class="absolute -top-5 left-4 text-white bg-emerald-600 p-2 rounded-lg"
      >Местоположение</p>

      <div class="my-2">
        <Select
            heading="Страна"
            ref="country"
            :selectable-items="countrysList"
            :id="'country'"
            :selected-value="activePoint.properties.country"
            @get-country-number="getCountryNumber"
        />
      </div>
      <div class="my-2">
        <Select
            ref="region"
            v-if="region"
            heading="Регион"
            :selectable-items="region"
            :id="'region'"
            :selected-value="activePoint.properties.region"
        />
      </div>

      <div class="flex my-2">
        <div class="bg-slate-700 pr-0.5 w-full" >
          <label class="text-white" for="direction">
            Широта
          </label>
          <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="direction" type="text" v-model="activePoint.properties.latLng[0]"
              @input="activePoint.setInputLatLng()"
          />
        </div>
        <div class="bg-slate-700 pl-0.5 w-full" >
          <label class="text-white" for="direction">
            Долгота
          </label>
          <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="direction" type="text" v-model="activePoint.properties.latLng[1]"
              @input="activePoint.setInputLatLng()"
          />
        </div>
      </div>

    </div>
    <div class="relative border-solid border-2 border-emerald-600 my-8 rounded-lg p-2 pt-4">
      <p
          class="absolute -top-5 left-4 text-white bg-emerald-600 p-2 rounded-lg"
      >Характеристики</p>

      <div class="my-2">
        <Select
            heading="Тип"
            :selectable-items="typeList"
            :id="'type'"
            :selected-value="activePoint.properties.type"
        />
      </div>
      <div class="my-2">
        <Select
            heading="Модель"
            :selectable-items="modelList"
            :id="'model'"
            :selected-value="activePoint.properties.model"
        />
      </div>
      <div class="my-2">
        <Select
            heading="Доп. Контроль"
            :selectable-items="flagsList"
            :id="'flags'"
            :multiple="true"
        />
      </div>
      <div class="my-2">
        <Select
            heading="Статус"
            :selectable-items="status"
            :id="'status'"
        />
      </div>

      <div class="flex my-2">
        <div class="bg-slate-700 pr-0.5" >
          <label class="text-white" for="angle">
            Ширина луча
          </label>
          <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="angle" type="text" v-model="activePoint.properties.angle"
              @input="activePoint.setInputWidth()"
          />
        </div>
        <div class="bg-slate-700 pl-0.5 pr-0.5" >
          <label class="text-white" for="direction">
            Направление луча
          </label>
          <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="direction" type="text" v-model="activePoint.properties.direction"
              @input="activePoint.setInputDirection()"
          />
        </div>
        <div class="bg-slate-700 pl-0.5" >
          <label class="text-white" for="distance">
            Длина луча
          </label>
          <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="distance" type="text"
              ref="distance"
              :value="activePoint.properties.distance"
              @input="(event) => {
                console.log(event.target.value);
                activePoint.setInputDistance(event.target.value)
              }"
          />
        </div>
      </div>
      <div class="flex my-2">
        <div class="bg-slate-700 pl-0.5 pr-0.5" >
          <label class="text-white" for="direction">
            Скорость легковые
          </label>
          <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="direction" type="text" v-model="activePoint.properties.car_speed"
          />
        </div>
        <div class="bg-slate-700 pl-0.5" >
          <label class="text-white" for="distance">
            Скорость грузовые
          </label>
          <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="distance" type="text" v-model="activePoint.properties.truck_speed"
          />
        </div>
      </div>
      <div class="inline-flex items-center">
        <label class="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="teal">
          <input type="checkbox"
                 class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-emerald-600 checked:bg-emerald-600 checked:before:bg-emerald-600 hover:before:opacity-10"
                 id="avs_checkbox"
                 v-model="ascBlockChecked"/>
          <span
              class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                   stroke="currentColor" stroke-width="1">
                <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
              </svg>
            </span>
        </label>
        <label
            class="text-white"
            for="avs_checkbox">
          Контроль средней скорости
        </label>
      </div>
      <div v-if="ascBlockChecked">
        <div class="flex my-2">
          <div
              v-if="activePoint.properties.ASC.previous"
              class="bg-slate-700 pl-0.5 pr-0.5 w-1/3" >
            <label class="text-white" for="direction">
              Предыдущая
            </label>
            <input
                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="direction" type="text" v-model="activePoint.properties.ASC.previous"
            />
          </div>
          <div class="bg-slate-700 pl-0.5 pr-0.5 w-1/3" >
            <label class="text-white" for="distance">
              Средняя скорость
            </label>
            <input
                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="distance" type="text" v-model="activePoint.properties.ASC.speed"
            />
          </div>
          <div
              v-if="activePoint.properties.ASC.next || !activePoint"
              class="bg-slate-700 pl-0.5 w-1/3" >
            <label class="text-white" for="distance">
              Следующая
            </label>
            <input
                class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="distance" type="text" v-model="activePoint.properties.ASC.next"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="relative border-solid border-2 border-emerald-600 my-8 rounded-lg p-2 pt-4">
      <p
          class="absolute -top-5 left-4 text-white bg-emerald-600 p-2 rounded-lg"
      >Информация</p>
      <p class="text-white my-2">Дата создания: <span>{{ activePoint.properties.dateCreate }}</span></p>
      <p class="text-white my-2">Дата обновления: <span>{{ activePoint.properties.lastUpdate }}</span></p>
      <p class="text-white my-2">Модератор: <span>{{ activePoint.properties.user }}</span></p>
    </div>
    <div v-if="!activePoint.properties.ulid" class="flex">
      <button class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
        Создать
      </button>
    </div>
    <div v-if="activePoint.properties.isDeleted === 0" class="flex">
      <button class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
        Обновить
      </button>
    </div>
  </form>
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
      activePoint: null,
      countryNumber: null,
      region: null,
      ascBlockChecked: false,
      status:[
        { value: '1', label: 'Подтвержден' },
        { value: '2', label: 'Не подтвержден' },
        { value: '3', label: 'Удалена' },
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
  methods: {
    closeBlock() {
      this.activePoint.isEdited = false;
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
    backEditBlock() {
      this.activePoint.isActive = true;
      this.activePoint.isEdited = false;

      const params = this.$route.params;
      this.$router.push({ name: 'InfoBlock', params: {
          lat: params.lat,
          lng: params.lng,
          zoom: params.zoom,
        }})
    },
    getCountryNumber(number: number) {
      if(number === 0) {
        this.activePoint.properties.region = 0
        this.region = null;
        return;
      }
      if(this.countryNumber !== null && this.countryNumber !== (number - 1)) {
        if(this.$refs.region) {
          this.$refs.region.selectedItem = this.regionsList[number - 1][0];
        }
      }
      this.countryNumber = number - 1
      this.region = this.regionsList[number - 1]
    },
  },
  created() {
    this.activePoint = store.getters.activePoint;
    this.activePoint.properties.isEdited = true;

    if(this.activePoint.properties.isASC) {
      this.ascBlockChecked = true;
    }
  },
}

</script>
<script setup lang="ts">
</script>