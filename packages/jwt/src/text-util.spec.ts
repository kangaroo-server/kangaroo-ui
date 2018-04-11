/*
 * Copyright (c) 2018 Michael Krotscheck
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TextUtil } from './text-util';

/**
 * List of various language strings, drawn from http://clagnut.com/blog/2380/
 */
// tslint:disable
export const pangrams = {
    arabic: 'صِف خَلقَ خَودِ كَمِثلِ الشَمسِ إِذ بَزَغَت — يَحظى الضَجيعُ بِها نَجلاءَ مِعطارِ',
    azeri: 'Zəfər, jaketini də papağını da götür, bu axşam hava çox soyuq olacaq.',
    breton: 'Yec’hed mat Jakez ! Skarzhit ar gwerennoù-mañ, kavet e vo gwin betek fin ho puhez.',
    bulgarian: 'За миг бях в чужд плюшен скърцащ фотьойл.',
    catalan: '«Dóna amor que seràs feliç!». Això, il·lús company geniüt, ja és un lluït rètol blavís d’onze kWh.',
    cherokee: 'ᎠᏍᎦᏯᎡᎦᎢᎾᎨᎢᎣᏍᏓᎤᎩᏍᏗᎥᎴᏓᎯᎲᎢᏔᎵᏕᎦᏟᏗᏖᎸᎳᏗᏗᎧᎵᎢᏘᎴᎩ ᏙᏱᏗᏜᏫᏗᏣᏚᎦᏫᏛᏄᏓᎦᏝᏃᎠᎾᏗᎭᏞᎦᎯᎦᏘᏓᏠᎨᏏᏕᏡᎬᏢᏓᏥᏩᏝᎡᎢᎪᎢ ᎠᎦᏂᏗᎮᎢᎫᎩᎬᏩᎴᎢᎠᏆᏅᏛᎫᏊᎾᎥᎠᏁᏙᎲᏐᏈᎵᎤᎩᎸᏓᏭᎷᏤᎢᏏᏉᏯᏌᏊ ᎤᏂᏋᎢᏡᎬᎢᎰᏩᎬᏤᎵᏍᏗᏱᎩᎱᎱᎤᎩᎴᎢᏦᎢᎠᏂᏧᏣᏨᎦᏥᎪᎥᏌᏊᎤᎶᏒᎢᎢᏡᎬᎢ ᎹᎦᎺᎵᏥᎻᎼᏏᎽᏗᏩᏂᎦᏘᎾᎿᎠᏁᎬᎢᏅᎩᎾᏂᎡᎢᏌᎶᎵᏎᎷᎠᏑᏍᏗᏪᎩ ᎠᎴ ᏬᏗᏲᏭᎾᏓᏍᏓᏴᏁᎢᎤᎦᏅᏮᏰᎵᏳᏂᎨᎢ.',
    croatian: 'Gojazni đačić s biciklom drži hmelj i finu vatu u džepu nošnje.',
    czech: 'Nechť již hříšné saxofony ďáblů rozezvučí síň úděsnými tóny waltzu, tanga a quickstepu.',
    danish: 'Quizdeltagerne spiste jordbær med fløde, mens cirkusklovnen Walther spillede på xylofon.',
    dzongkha: 'ཨ་ཡིག་དཀར་མཛེས་ལས་འཁྲུངས་ཤེས་བློའི་གཏེར༎ ཕས་རྒོལ་ཝ་སྐྱེས་ཟིལ་གནོན་གདོང་ལྔ་བཞིན༎ ཆགས་ཐོགས་ཀུན་བྲལ་མཚུངས་མེད་འཇམ་དབྱངསམཐུས༎ མཧཱ་མཁས་པའི་གཙོ་བོ་ཉིད་འགྱུར་ཅིག།',
    esperanto: 'Eble ĉiu kvazaŭ-deca fuŝĥoraĵo ĝojigos homtipon.',
    estonian: 'Põdur Zagrebi tšellomängija-följetonist Ciqo külmetas kehvas garaažis',
    finnish: 'Albert osti fagotin ja töräytti puhkuvan melodian.',
    french: 'Voix ambiguë d’un cœur qui au zéphyr préfère les jattes de kiwi.',
    west_frisian: 'Alve bazige froulju wachtsje op dyn komst',
    german: 'Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich',
    greek: 'Ταχίστη αλώπηξ βαφής ψημένη γη, δρασκελίζει υπέρ νωθρού κυνός Takhístè alôpèx vaphês psèménè gè, draskelízei ypér nòthroý kynós',
    hebrew: 'עטלף אבק נס דרך מזגן שהתפוצץ כי חם',
    hindi: 'ऋषियों को सताने वाले दुष्ट राक्षसों के राजा रावण का सर्वनाश करने वाले विष्णुवतार भगवान श्रीराम, अयोध्या के महाराज दशरथ के बड़े सपुत्र थे।',
    hungarian: 'Jó foxim és don Quijote húszwattos lámpánál ülve egy pár bűvös cipőt készít.',
    icelandic: 'Kæmi ný öxi hér, ykist þjófum nú bæði víl og ádrepa.',
    igbo: 'Nne, nna, wepụ he’l’ụjọ dum n’ime ọzụzụ ụmụ, vufesi obi nye Chukwu, ṅụrịanụ, gbakọọnụ kpaa, kwee ya ka o guzoshie ike; ọ ghaghị ito, nwapụta ezi agwa.',
    indonesian: 'Muharjo seorang xenofobia universal yang takut pada warga jazirah, contohnya Qatar.',
    irish: 'D’fhuascail Íosa Úrmhac na hÓighe Beannaithe pór Éava agus Ádhaimh',
    italian: 'Quel vituperabile xenofobo zelante assaggia il whisky ed esclama: alleluja!',
    japanese_1: 'あめ つち ほし そら / やま かは みね たに / くも きり むろ こけ / ひと いぬ うへ すゑ / ゆわ さる おふ せよ / えのえを なれ ゐて',
    japanese_2: '天 地 星 空 / 山 川 峰 谷 / 雲 霧 室 苔 / 人 犬 上 末 / 硫黄 猿 生ふ 為よ / 榎の 枝を 馴れ 居て',
    javanese: '꧋ ꦲꦤꦕꦫꦏ꧈ ꦢꦠꦱꦮꦭ꧈ ꦥꦝꦗꦪꦚ꧈ ꦩꦒꦧꦛꦔ꧉',
    klingon: '    ', // because why not.
    korean: '키스의 고유조건은 입술끼리 만나야 하고 특별한 기술은 필요치 않다.',
    latin: 'Sic fugiens, dux, zelotypos, quam Karus haberis.',
    latvian: 'Muļķa hipiji mēģina brīvi nogaršot celofāna žņaudzējčūsku.',
    lithuanian: 'Įlinkdama fechtuotojo špaga sublykčiojusi pragręžė apvalų arbūzą',
    lojban: '.o’i mu xagji sofybakni cu zvati le purdi',
    macedonian: 'Ѕидарски пејзаж: шугав билмез со чудење џвака ќофте и кељ на туѓ цех.',
    malayalam: 'അജവും ആനയും ഐരാവതവും ഗരുഡനും കഠോര സ്വരം പൊഴിക്കെ ഹാരവും ഒഢ്യാണവും ഫാലത്തില്‍ മഞ്ഞളും ഈറന്‍ കേശത്തില്‍ ഔഷധ എണ്ണയുമായി ഋതുമതിയും അനഘയും ഭൂനാഥയുമായ ഉമ ദുഃഖഛവിയോടെ ഇടതു പാദം ഏന്തി ങ്യേയാദൃശം നിര്‍ഝരിയിലെ ചിറ്റലകളെ ഓമനിക്കുമ്പോള്‍ ബാ‍ലയുടെ കണ്‍കളില്‍ നീര്‍ ഊര്‍ന്നു വിങ്ങി.',
    mapudungun: 'Gütxam minchetu apochiküyenh: ñizol che mamüll ka raq kushe lhafkenh mew.',
    mongolian: 'Щётканы фермд пийшин цувъя. Бөгж зогсч хэльюү.',
    myanmar: 'သီဟိုဠ်မှ ဉာဏ်ကြီးရှင်သည် အာယုဝဍ္ဎနဆေးညွှန်းစာကို ဇလွန်ဈေးဘေးဗာဒံပင်ထက် အဓိဋ္ဌာန်လျက် ဂဃနဏဖတ်ခဲ့သည်။',
    norwegian: 'Vår sære Zulu fra badeøya spilte jo whist og quickstep i min taxi.',
    polish: 'Jeżu klątw, spłódź Finom część gry hańb!',
    portuguese: 'À noite, vovô Kowalsky vê o ímã cair no pé do pingüim queixoso e vovó põe açúcar no chá de tâmaras do jabuti feliz.',
    romanian: 'Muzicologă în bej vând whisky și tequila, preț fix.',
    russian: 'В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!',
    sanskrit: 'कः खगौघाङचिच्छौजा झाञ्ज्ञोऽटौठीडडण्ढणः। तथोदधीन् पफर्बाभीर्मयोऽरिल्वाशिषां सहः।।',
    gaelic_scottish: 'Mus d’fhàg Cèit-Ùna ròp Ì le ob.',
    serbian: 'Gojazni đačić s biciklom drži hmelj i finu vatu u džepu nošnje.',
    slovak: 'Kŕdeľ ďatľov učí koňa žrať kôru.',
    slovenian: 'Hišničin bratec vzgaja polže pod fikusom.',
    spanish: 'Benjamín pidió una bebida de kiwi y fresa; Noé, sin vergüenza, la más exquisita champaña del menú.',
    swedish: 'Flygande bäckasiner söka hwila på mjuka tuvor. ',
    tagalog: 'Ang bawat rehistradong kalahok sa patimpalak ay umaasang magantimpalaan ng ñino',
    thai: 'นายสังฆภัณฑ์ เฮงพิทักษ์ฝั่ง ผู้เฒ่าซึ่งมีอาชีพเป็นฅนขายฃวด ถูกตำรวจปฏิบัติการจับฟ้องศาล ฐานลักนาฬิกาคุณหญิงฉัตรชฎา ฌานสมาธิ',
    tibetan: '༈ དཀར་མཛེས་ཨ་ཡིག་ལས་འཁྲུངས་ཡེ་ཤེས་གཏེར། །ཕས་རྒོལ་ཝ་སྐྱེས་ཟིལ་གནོན་གདོང་ལྔ་བཞིན། །ཆགས་ཐོགས་ཀུན་བྲལ་མཚུངས་མེད་འཇམ་བྱངས་མཐུས། །མ་ཧཱ་མཁས་པའི་གཙོ་བོ་ཉིད་གྱུར་ཅིག།',
    turkish: 'Pijamalı hasta yağız şoföre çabucak güvendi.',
    ukranian: 'Чуєш їх, доцю, га? Кумедна ж ти, прощайся без ґольфів!',
    urdu: 'ٹھنڈ میں، ایک قحط زدہ گاؤں سے گذرتے وقت ایک چڑچڑے، باأثر و فارغ شخص کو بعض جل پری نما اژدہے نظر آئے۔',
    uyghur: 'ئاۋۇ بىر جۈپ خوراز فرانسىيەنىڭ پارىژ شەھرىگە يېقىن تاغقا كۆچەلمىدى.',
    yoruba: 'Ìwò̩fà ń yò̩ séji tó gbojúmó̩, ó hàn pákànpò̩ gan-an nis̩é̩ rè̩ bó dò̩la. ',
    welsh: 'Parciais fy jac codi baw hud llawn dŵr ger tŷ Mabon.'
};
// tslint:enable

describe('TextUtil', () => {

    describe('Language base64 roundtrip:', () => {

        Object.keys(pangrams).forEach((key) => {
            it(key, () => {
                const original = pangrams[key];
                const encoded = TextUtil.b2aUnicode(original);
                const decoded = TextUtil.a2bUnicode(encoded);
                expect(decoded).toEqual(original);
            });
        });
    });
});
