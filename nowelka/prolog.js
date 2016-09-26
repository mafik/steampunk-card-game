
var galard = {
  id: 'galard',
  image: 'pirate.png',
  title: 'Galard'
};

var zdrajca = {
  id: 'zdrajca',
  image: 'blackbeard_by_yakonusuke-d5hk0yl.png',
  title: 'Zdrajca'
};

var dowodca = {
  id: 'dowodca',
  title: 'Dowódca gwardii admiralskiej',
  image: 'pzo1124_constable_by_rhineville-d5lot9z.png'
};

var straznicy = {
  id: 'straznicy',
  image: 'Mercenary_by_Werdandi.png',
  title: 'Strażnici'
};

var gwardzista1 = {
  id: 'g1',
  image: 'dbe59d5a1bf65c753a2403096b7608c1-d2r7o2g.png',
  title: 'Gwardzista'
};

var gwardzista2 = {
  id: 'g2',
  image: 'dbe59d5a1bf65c753a2403096b7608c1-d2r7o2g2.png',
  title: 'Gwardzista'
};

var martin = {
  id: 'martin',
  image: 'steam_soldier_by_idriu95-d3bv02q.png',
  title: 'Martin'
};

var philip = {
  id: 'philip',
  image: 'Steampunk_Rooster_by_ursulav.png',
  title: 'Philip'
};

var karta = {
  id: 'karta',
  image: 'Joker_Card.png',
  title: 'Karta'
};

var sakiewka = {
  id: 'sakiewka',
  image: 'leather_belt_and_pouch_study_by_lupodirosso-d59m50d.jpg',
  title: 'Sakiewka'
};

var tavern = 'tavern_by_anthonyavon-d6h3utd.jpg';
var alley = 'boston_alley_by_wwudesign-d5t1uqg.jpg';
var port = 'boston_port_fog_by_wwudesign-d5t1x0t.jpg';
var street = 'new_york_street_by_wwudesign-d5t1waj.jpg';
var underground = 'underground_temple_by_wwudesign-d5t1wmz.jpg';

var sequence = [];
var scene_index = 0;

sequence.push({
  timeout: 4,
  music: 'dydjej_inja_-_Open.mp3',
  fullscreen: true,
  enter: 'fly_in 1s',
  exit: 'fly_out 1s',
  message: [
    'Zwycięstwo',
    'Tak zwany... triumf.',
    'To wspaniały moment.',
    'Wojna i tak trwała zbyt długo.',
    'Czemu więc wspominam tą chwilę tak gorzko?',
    'My wygraliśmy...',
    '...ale Ja przegrałem.'
  ]
});

sequence.push({
  background: tavern,
  ambient: '209354__robinhood76__04622-tavern-ambience-looping.mp3',
  left: { 0: galard },
  right: { 0: zdrajca, 1: martin },
  _: [
    { source: 'galard',
      message: 'Wygrałem. Jak zawsze zresztą' },
    { source: 'zdrajca',
      message: 'Masz dziś szczęście.' },
    { source: 'galard',
      message: 'Szczęście? Z takim przeciwnikiem wygrałaby i moja papuga.' },
    { source: 'martin',
      message: 'hahaha!' },
    { source: 'galard',
      message: 'Czy Ty w ogóle patrzysz na karty?' },
    { source: 'zdrajca',
      message: 'Tak... Oczywiście... Ja... Eh...',
      thought: 'Tak, ja też uważam, że zachowuje się dziwnie. Szkoda, że dopiero teraz' },
    { source: 'galard',
      message: 'Kto wybrał to podłe miejsce? Ruszmy tyłki i znajdźmy lokal godny zwycięzców!' },
    { source: 'zdrajca',
      message: 'Nie! To absolutnie niemożliwe!' },
    { source: 'galard',
      message: 'Niby czemu? Wygrałem i to ja wyznaczam zasady!',
      exit: 'fly_out 1s' }
  ]
});

sequence.push({
  background: tavern,
  ambient: '209354__robinhood76__04622-tavern-ambience-looping.mp3',
  music: 'Zapac_-_They_re_coming....mp3',
  left: { 0: galard },
  right: { 0: dowodca },
  _: [
    { source: 'dowodca',
      message: 'Nie tym razem.  W imieniu admirała Harvey Iskariona rozkazuję Ci oddać się w nasze ręce. Złóż broń i proś o łaskę.' },
    { source: 'galard',
      message: 'Już jesteś pijany? Ledwie wylądowaliśmy.' },
    { source: 'dowodca',
      message: 'Ja w przeciwieństwie do Ciebie wiem jak służyć Imperium. Dopuściłeś się zdrady i za nią odpowiesz!' },
    { source: 'galard',
      message: 'Zdrady? Mówisz o mnie czy wyładowujesz się za żonę?' },
    { source: 'dowodca',
      message: 'Koniec błazenady! Poddaj się bo i tak nie masz szans.' },
    { source: 'galard',
      message: 'Skoro tak Ci się wydaje...' },
    { thought: 'Tak...lubię karty. Niektórzy nazywają mnie hazardzistą, ale...dla mnie to rodzaj pasji, na pograniczu namiętności. Jeśli już myślisz, że nie jestem normalny, muszę przyznać, że znacznie mi to schlebia. Ale wracając do kart. Dla mnie życie to jedna wielka rozgrywka. Ktoś ma asa, ktoś wraca z pustymi kieszeniami. Tak się złożyło, że jedynym co miałem  tego dnia ze sobą był joker. W postaci pięknej bomby dymnej. Jeśli chcesz ją rzucić tym s...strażnikom kliknij na kartę.' },
    { thought: 'Zwróć uwagę na oznaczenia.. Bla bla... tłumaczenie, a że nie pamiętam dokładnie dopiszę później.' },
    { thought: 'Teraz czas na ruch przeciwnika. Zastanawiasz się co zrobią? Ja wtedy „umierałem” z ciekawości.' },
    { thought: 'A więc zobaczmy...jakiś ładny opis podliczania i podsumowanie: jednym słowem: ...' }
  ]
});

sequence.push({
  background: 'black',
  music: 'Zapac_-_They_re_coming....mp3',
  fullscreen: true,
  enter: 'spinning_fly_in 1.5s ease-out',
  exit: 'fly_out .5s',
  sound: '44366__debudding__spanish-lick-i-acoustic-ab-split-stereo-pair-oktava.mp3',
  message: 'Blackjack',
  start_fun: function() {
    add_item(karta);
  }
});

sequence.push({
  background: alley,
  left: { 0: galard },
  music: 'Zapac_-_They_re_coming....mp3',
  thought: [
    'Wyskakując przez okno pomyślałem, że ta knajpa nie była jednak takim złym wyborem.',
    'W końcu pierwsze piętro daje większe możliwości niż dziesiąte. Wybierając to miejsce Zdenerwowany Mężczyzna dal ciała.',
    'Ochrzaniłbym go...',
    'Oczywiście gdybym nie chciał go zabić.',
    'Przy okazji zdobyłem przydatną kartę: ucieczka.',
    'Zapomniałem chyba wspomnieć co potrafię? Może i czasami brak mi pieniędzy, ale nigdy kart.',
    'W sytuacjach takich jak ta najczęściej korzystam z  kart kondycji (oznaczonych moją zgrabną nogą). Należą do nich: wspinanie i unik. A od tego momentu również ucieczka.',
    'Karty nauczyły mnie pewnych sztuczek...nie tylko manualnych. W kategorii zręczność: używanie wytrychów do skrzyń i skradanie się.',
    'Nigdy nie mówiłem, że jestem święty.',
    'Urok to moje drugie imię. W ramach charyzmy dysponuję obłędną kartą blef i rzeczowa argumentacja.',
    'Ostrzegam, gdy nie podziałają słowa mam inne środki perswazji W kategorii siła stosuję karty: cios w głowę, strzał z pistoletu.',
    'Nie popadając w fałszywą skromność muszę przyznać: jestem niezły. Więc jeśli już używasz moich kart, bądź tak miły i wygraj.',
    'Życie to jedna wielka karcianka. Czasem daje Ci szansę wyboru w jaką partię chcesz pograć.'
  ]
});

sequence.push({
  background: alley,
  left: { 0: galard },
  right: { 0: straznicy },
  music: 'Zapac_-_They_re_coming....mp3',
  _: [
    { thought: 'Konwencje wyborów są chyba oczywiste. Jednak na wszelki wypadek decyzje prowadzące do konfrontacji oznaczone są typami starć. Usta to rozmowa, ręka zręczność, noga kondycja, a pięknie umięśnione ramie...walka. Więc wybieraj. Tylko pamiętaj dobrze ocenić przeciwnika!' },
    {
      source: 'galard',
      thought: 'A więc...wyskoczyłem z tego okna na tyle cicho by nie zwrócić uwagi strażników stojących przy karczmie. Miałem ułamek sekundy by zdecydować:',
      0: {
        text: 'zaatakować strażników',
        next: 'walka ze strażnikami',
        action: 'fight'
      },
      1: {
        text: 'skradać się',
        next: 'skradanie obok strażników',
        action: 'dexterity'
      }
    },
    {
      id: 'walka ze strażnikami',
      source: 'galard',
      message: 'Zwykłe, pijane i bardzo przestraszone młokosy. Czuję się niedoceniony.',
      next: 'na santa-marię',
    },
    {
      id: 'skradanie obok strażników',
      source: 'galard',
      message: 'Już po moim skoku powinienem się spodziewać, że są głusi jak pień.',
      next: 'na santa-marię' 
    }
  ]
});

sequence.push({
  id: 'na santa-marię',
  background: alley,
  music: 'Zapac_-_They_re_coming....mp3',
  left: { 0: galard },
  source: 'galard',
  message: 'A teraz na „Santę Marię”.',
  thought: 'Karty nie są moimi jedynymi sprzymierzeńcami. Nie wygrałbym wojny gdyby nie oddana armia i potężna flota. Mam nadzieję, że na moim flagowym okręcie, wśród towarzyszy broni, będę bezpieczny.'
});

sequence.push({
  background: port,
  music: 'Zapac_-_They_re_coming....mp3',
  left: { 0: galard },
  _: [
    { thought: 'Niestety myliłem się, przybyłem zbyt późno.' },
    {
      message: 'Pełno gwardzistów. Do diabła, mój statek, zabrali mój statek!',
      source: 'galard'
    },
    {
      message: 'Lepiej stąd znikać zanim...',
      source: 'galard'
    }
  ]
});

sequence.push({
  background: port,
  music: 'Zapac_-_They_re_coming....mp3',
  left: { 0: galard },
  right: { 0: gwardzista1, 1: gwardzista2 },
  _: [
    { message: 'To on! Nie ruszaj się!',
      source: 'g1' }, 
    { message: 'Admirale Galard, jest Pan aresztowany, proszę nie próbować żadnych sztuczek, mamy rozkaz sprowadzić Pana żywego lub martwego.',
      source: 'g2' },
    { thought: 'Mogłem ich posłuchać, albo jeszcze raz spróbować szczęścia. Wybór był oczywisty. Zobaczmy, czy moja nowa karta na coś się przyda:',
      0: { text: 'Nagłym ruchem wskakujesz w boczną alejkę i uciekasz',
           action: 'dexterity' } }
  ]
});

sequence.push({
  background: street,
  music: 'Zapac_-_They_re_coming....mp3',
  left: { 0: galard },
  thought: 'Biegłem na ślepo wąskimi portowymi alejkami. Goniły mnie okrzyki zirytowanych przechodniów, których w pośpiechu potrącałem, oraz dwaj spoceni gwardziści. Byłem od nich szybszy. Nie przewidziałem tylko, że po którymś zakręcie z rzędu wpadnę na kolejny patrol. Ci gwardziści byli wypoczęci. I oczywiście poznali mnie.'
});

sequence.push({
  background: street,
  music: 'Zapac_-_They_re_coming....mp3',
  left: { 0: galard },
  right: { 0: gwardzista2, 1: straznicy },
  _: [{
    message: 'To on, brać go.',
    source: 'g2'
  }, {
    message: 'Teraz nam nie ucieknie, jesteś otoczony!',
    source: 'straznicy'
  }, {
    thought: 'Często porażka w konfrontacji nie oznacza końca, a prowadzi do innych wydarzeń, które normalnie nie wystąpiłyby. Staraj się jednak wygrywać. Fortuna nie zawsze będzie tak łaskawa i kiedyś skończy się dla nas obojga.',
    message: 'Nie pozwalając mi uciekać, szkodzicie tylko samym sobie',
    source: 'galard',
    0: {
      text: 'Walcz z gwardzistami',
      action: 'fight'
    }
  }, {
    thought: 'Dwóch zabitych, jeden ranny, jeden niedraśnięty. Ten ostatni to oczywiście ja.'
  }, {
    source: 'g2',
    message: 'S... Stój! Jesteś... a... resztowany, zdrajco'
  }, {
    source: 'galard',
    message: 'Zamiast wymyślać te niewyszukane inwektywy lepiej skup się na przeżyciu, do czasu aż sanitariusze nie przyjdą Cię połatać.'
  }, {
    thought: 'Rannemu Gwardziście próbuje wstać, słania się, upada znowu, z kieszeni munduru wypada mu jedwabna, wypchana sakiewka'
  }, {
    source: 'galard',
    message: 'O, co my tu mamy. Pozwolisz, że to wezmę? Przydadzą mi się fundusze na moją ucieczkę. Nie martw się (poklepuje rannego po ramieniu), zwrócę całość jak wszystko się wyjaśni.'
  }, {
    source: 'g2',
    message: 'D... drań.',
    start_fun: function() {
      add_item(sakiewka);
    }
  }]
});

sequence.push({
  background: street,
  music: 'Zapac_-_They_re_coming....mp3',
  left: { 0: galard },
  thought: [
    'To mój pierwszy łup wojenny, ale coś mi mówi, że jeśli chcę przeżyć, będę musiał robić to częściej.',
    'W cywilnej części portu zacumował mój mały prywatny okręt. Spróbuję do niego dotrzeć. Nikt prócz moich najbardziej zaufanych członków załogi nie powinien o nim wiedzieć'
  ]
});

sequence.push({
  background: underground,
  music: 'Zapac_-_They_re_coming....mp3',
  left: { 0: galard },
  right: { 0: martin, 1: philip },
  _: [
    { message: 'Martin, Philip, co wy tu robicie?',
      source: 'galard' },
    { source: 'martin',
      message: 'Kapitanie, nie ma czasu do stracenia. Zabrali nasz okręt wojenny, wyłapują załogę. Nie wiem co się dzieje, ale nie wygląda to dobrze.' },
    { source: 'philip',
      message: 'Co Ty nie powiesz?' },
    { message: 'Gdzie Mr. Craak?',
      source: 'galard' },
    { source: 'martin',
      message: 'Nie wiemy kapitanie.' },
    { source: 'philip',
      message: 'Ale musimy uciekać.' },
    { message: 'A więc żegnaj ...przyjacielu.',
      source: 'galard' },
  ]
});

sequence.push({
  background: 'black',
  music: 'Zapac_-_They_re_coming....mp3',
  fullscreen: true,
  message: 'Koniec',
  enter: 'spinning_fly_in 2s'
});
