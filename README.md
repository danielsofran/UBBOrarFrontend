# UBB Orar Frontend

Salut! Acesta este frontend-ul pentru aplicația de orar a Facultății de Matematică și Informatică din cadrul Universității Babeș-Bolyai. Acesta este un proiect open-source, deci oricine poate contribui la el.

În continuare, vei găsi informații despre arhitetura aplicației, cum să o rulezi și cum să contribui.

> [!TIP]
> Aplicația se poate folosi și în mod offline, fiind o aplicație PWA. Trebuie doar să o adaugi la ecranul de start al telefonului tău, folosind opțiunea "Install" din browser.

## Motivație

Acest proiect este un proiect React Ionic cu Typescript.

Motivația pentru care am ales Ionic este pentru că acesta oferă un set de componente predefinite care sunt optimizate pentru a arăta și a funcționa bine pe orice dispozitiv, indiferent de dimensiunea ecranului. Acesta oferă și un set de componente care sunt optimizate pentru a arăta și a funcționa bine pe dispozitive mobile, incluzând o convertire relativ ușoară a aplicației web într-o aplicație mobilă nativă.

Un alt motiv este folosirea de framework-uri moderne, dar și studiate de către studenți în cadrul cursurilor de la facultate. Acesta oferă oportunitatea de a învăța și de a lucra cu tehnologii moderne, dar și de a contribui la un proiect real.

## Development

### Requirements

- [Node.js](https://nodejs.org)
- [npm](https://www.npmjs.com)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli) - `npm install -g @ionic/cli`

### Librării folosite

- [Vite](https://vitejs.dev)
- [React](https://react.dev)
- [Ionic](https://ionicframework.com)
- [Typescript](https://www.typescriptlang.org)
- [React Router](https://reactrouter.com)
- [Redux](https://redux.js.org)
- [Capacitor](https://capacitorjs.com)

### Cum să rulezi

1. Clonează proiectul
2. Instalează dependințele folosind `npm install`
3. Rulează proiectul folosind `npm run dev`

> [!WARNING]
> Daca aveti erori din cauza `eslint`, puteti sa il dezactivati la nivel de IDE.

## Arhitectură

În continuare, vei găsi o scurtă descriere a arhitecturii aplicației.

### Structura

Proiectul este împărțit în mai multe foldere, fiecare cu un scop anume.

- `src` - conține codul sursă al aplicației
  - `components` - conține componente reutilizabile
    - `core` - conține componente care sunt folosite strict pentru design, fără a avea logică de business sau funcționalitate
  - `pages` - conține paginile aplicației
  - `reducers` - conține reducerii Redux, sau state-urile la nivel de aplicație
  - `storage` - conține store-ul aplicației, adică datele savlate local
  - `service` - conține codul pentru comunicarea cu serverul, dar și pentru procesarea datelor
  - `model` - conține modelele de date folosite în aplicație

Alte fișiere din folderul `src`:

- `App.tsx` - conține componenta principală
- `main.tsx` - conține codul de pornire
- `store.ts` - conține store-ul Redux
- `Layout.tsx` - conține layout-ul, care se aplică pe toate paginile

> [!NOTE]
> După cum puteți vedea, toate helperele pentru modele sunt într-un fișier utils din service. Ideea e sa decuplăm modelul de componente, astfel încat sa putem modifica cu ușurintă modelul fără a afecta codul din întreaga aplicație.

> [!IMPORTANT]
> Fluxul pentru datele locale din aplicație este următorul: datele sunt salvate într-un store din folderul `storage`, iar apoi sunt încarcate in store-ul Redux din aplicație in `App.tsx`. Acest lucru se face pentru a putea accesa și modifica cu usurinta datele din orice componentă.

## Deployment

Momentan, aplicația este hostată doar pe GitHub Pages, dar se poate hosta pe orice alt serviciu de hosting static.

Totodată, aceasta permite și creearea de aplicații mobile, folosind Capacitor. Pentru a crea o aplicație mobilă, urmați pasii de [aici](https://capacitorjs.com/docs/getting-started).

### Cum se face deploy

1. Checkout pe branch-ul `web`
2. Rebase local peste branch ul pe care lucrezi
3. Rezolvă posibilele conflicte, si nu uita sa adaptezi codul (in principal diferentele sunt la path urile paginilor)
4. Rulează `npm run build` sau `ionic build --prod` sau `npm run predeploy`
5. Rulează `npm run preview` pentru a vedea cum arată aplicația înainte de a o publica
6. Rulează `npm run deploy` pentru a publica aplicația

Acest ultim pas va face un commit pe branch-ul `gh-pages`, care va fi publicat automat pe GitHub Pages în câteva minute.

> [!NOTE]
> Poți testa aplicatia și pe telefon, pentru a asigura capabilitatea de a fi folosita pe dispozitive mobile ca PWA.

> [!WARNING]
> Este recomandat sa rulezi pasul 5 înainte de a face deploy, pentru a te asigura ca aplicația arată și functionează corect.

> [!NOTE]
> Pentru a face deploy, trebuie să ai anumite permisiuni pe repository-ul de GitHub. Daca nu ai aceste permisiuni, contacteaza unul dintre colaboratori, deși odata ce un pull request este acceptat, acesta va fi deployat automat.

## Credits

Mulțumim tuturor celor care au contribuit la acest proiect, fie prin cod, fie prin feedback sau sugestii.

Mulțumesc în mod special providerului de date pentru orarul universitatii, Horatiu Udrea, care a creeat api-ul pentru a putea accesa datele: [API Orar](https://github.com/horatiu-udrea/cs-ubb-timetable-parser)

## Contribuție

1. Creează un branch local nou folosind `git checkout -b numele-branch-ului`
2. Lucrează pe branch-ul respectiv
3. Dacă ești gata, creează un commit și un pull request pe GitHub

> [!WARNING]
> Mesajurile commit urilor trebuie să fie cât mai descriptive, adică să descrie ce modificare a fost făcută.

4. După acest pas, pull request-ul tău va fi revizuit de către unul dintre colaboratori.
5. Dacă pull request-ul tău este acceptat, acesta va fi merge-uit în branch-ul principal, folosing rebase.
6. Dacă pull request-ul tău este respins, vei primi un mesaj cu motivele pentru care a fost respins, iar tu vei trebui să faci modificările necesare și să resubmiti pull request-ul, prin adaugarera unor noi commit pe branch-ul tău.
7. Procesul de merge implică merge-uirea commiturilor tale de pe branch într-un singur commit, care va fi adăugat în branch-ul principal.
8. După ce pull request-ul tău a fost merge-uit, branch-ul tău va fi șters.

> [!TIP]
> După un anumit număr de pull requesturi, se va lua în considerare adăugarea ta în lista de colaboratori, dacă ești interesat.