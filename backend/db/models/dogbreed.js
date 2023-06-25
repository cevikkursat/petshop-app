const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectID = mongoose.Schema.Types.ObjectID;

const dogsbreedSchema = new Schema(
  {
    _id: ObjectID,
    predictID: Number,
    name: String,
    desc: String,
    pic: String,
    ratings: {
      type: {
        Enerji_Seviyesi: Number,
        Egzersiz_Gereksinimleri: Number,
        Oyun_Kabiliyeti: Number,
        Sahibine_Şefkat: Number,
        Köpeklerle_Dostluk: Number,
        Diğer_Evcil_Hayvanlarla_Dostluk: Number,
        Yabancılarla_Dostluk: Number,
        Eğitebilirlik: Number,
        Bakım_Gereksinimleri: Number,
        Sıcaklık_Hassasiyeti: Number,
        Ses: Number,
        Bekçilik: Number,
      },
    },
    Tür: String,
    Ağırlık: String,
    Yükseklik: String,
    Aile: String,
    Menşei: String,
    Menşei_Tarihi: String,
    Yaşam_Süresi: String,
    Karakter: String,
    Tarih: String,
    Fiziksel_Nitelikler: {
      type: {
        Vücut: String,
        Kafa: String,
        Kulaklar: String,
        Gözler: String,
        Bacaklar_Ayaklar: String,
        Kuyruk: String,
        Tüy: String,
        Renk: String,
      },
    },
    Bakım: {
      type: {
        Bakım: String,
        Beslenme: String,
        Egzersiz: String,
        Eğitim: String,
        Sağlık: String,
      },
    },
  },
  { versionKey: false, timestamps: true }
);

const dogsbreed = mongoose.model("dogsbreed", dogsbreedSchema);

module.exports = dogsbreed;
