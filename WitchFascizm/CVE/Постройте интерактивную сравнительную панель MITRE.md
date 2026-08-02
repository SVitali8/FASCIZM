<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Постройте интерактивную сравнительную панель MITRE ATT\&CK, D3FEND и ENGAGE с фильтрами по тактикам атак, техникам, защитным мерам и примерами реальных угроз, включая данные из версии v17.1, с визуализацией матриц и поиском по группам злоумышленников

Сделать полноценную «живую» веб‑панель я тут не могу, но могу дать вам архитектуру, формат данных и пример кода/структуры UI, на основе которых вы быстро соберёте интерактивную панель (например, на React + Python/FastAPI или только на Python + Streamlit). Ниже — как связать ATT\&CK v17.1, D3FEND и ENGAGE, какие фильтры реализовать и откуда брать данные.[^1][^2][^3][^4][^5][^6][^7][^8]

***

## Что именно вы хотите построить

Нужна панель, где одновременно визуализируются:

- Матрица MITRE ATT\&CK (Enterprise, версия v17.1: тактики, техники, группы, реальные кампании).[^2][^4][^1]
- MITRE D3FEND: тактические категории и защитные техники с привязкой к ATT\&CK‑техникам.[^5][^7]
- MITRE ENGAGE: активности/техники adversary engagement (denial, deception, engagement).[^6][^8]

Функциональность:

- Фильтры: по тактикам атак (ATT\&CK), техникам (ATT\&CK), защитным техникам (D3FEND), активностям ENGAGE, домену (Enterprise/Mobile/ICS/OT).[^1][^2][^5][^6]
- Поиск по группам злоумышленников (ATT\&CK Groups), отображение связанных техник и защитных мер.[^3][^4][^1]
- Визуализация матриц: как перегруппированный «Navigator»-стиль heatmap.[^3]

***

## Источники данных и модель

### MITRE ATT\&CK (v17.1)

- Официальные данные — STIX 2.1 JSON в репозитории `mitre-attack/attack-stix-data`; там тактики (`x-mitre-tactic`), техники (`attack-pattern`) и группы (`intrusion-set`) для v17.x.[^4]
- Для ICS/Enterprise/Mobile отдельно есть Excel‑файлы тактик/техник v17.1, которые удобно использовать как «источник истины» по тактикам.[^2]

Ключевые сущности:

- Tactic: `id`, `name`, `short_name`, `description`, `domain`.
- Technique: `id` (Txxxx), `name`, `tactic_refs`, `description`, `data_sources`, `examples`.
- Group: `id` (Gxxxx), `name`, `aliases`, `country`, `techniques_used`.


### MITRE D3FEND

- D3FEND — онтология защитных техник, связанная с ATT\&CK‑техниками через Digital Artifact Ontology.[^7][^5]
- Последние релизы (например, v1.3.0) содержат ~267 защитных техник, разложенных по 7 тактическим категориям: Model, Harden, Detect, Isolate, Deceive, Evict, Restore.[^5][^7]

Сущности:

- DefensiveTactic: `name` (Model/Harden/Detect/... ).[^7][^5]
- DefensiveTechnique: `id`, `name`, `tactic`, `description`, `artifact_type`, `mapped_attack_techniques`.[^5][^7]


### MITRE ENGAGE

- ENGAGE — фреймворк для планирования активной обороны и взаимодействия с противником; пришёл на смену MITRE Shield.[^8][^6]
- Фокусируется на denial, deception, adversary engagement и помогает связать знания ATT\&CK о противнике с планированием защитных и обманных активностей.[^6][^8]

Сущности:

- EngageActivity / Technique: `id`, `name`, `category` (denial/deception/engagement), `goal`, `related_attack_techniques`, `related_d3fend_techniques`.[^8][^6]


### Объединённая модель

В БД (PostgreSQL) или в памяти (если прототип) удобно завести:

```text
attack_tactics(id, name, short_name, domain)
attack_techniques(id, name, tactic_id, description, ...)

attack_groups(id, name, aliases, country, ...)
group_techniques(group_id, technique_id)

d3fend_tactics(id, name)
d3fend_techniques(id, name, tactic_id, ...)

d3fend_to_attack(def_technique_id, attack_technique_id)

engage_activities(id, name, category, goal, ...)
engage_to_attack(engage_id, attack_technique_id)
engage_to_d3fend(engage_id, d3fend_technique_id)
```

Так вы сможете строить двунаправленные запросы: от группы → техники → защитные меры → активности ENGAGE.

***

## Визуализация матриц и панель

### 1. Матрица ATT\&CK (вкладка «ATT\&CK»)

- Ось X: тактики (Initial Access, Execution, Persistence и т.д.).[^9][^1]
- Ось Y: техники (одна строка на технику; sub‑techniques можно либо сворачивать в родительскую, либо показывать как отдельные строки).[^9][^1]
- Цвет ячеек:
    - По наличию маппинга D3FEND (чем больше защитных техник, тем насыщеннее цвет).[^7]
    - Дополнительный слой — количество групп/кампаний, использующих технику.[^4][^1]

Интерактивность:

- Hover tooltip: краткое описание техники, список групп, защитных мер, ENGAGE‑активностей.[^1][^4][^8][^7]
- Click: раскрытие сбоку подробной карточки техники.


### 2. Матрица защитных мер D3FEND (вкладка «D3FEND»)

- Ось X: тактические категории D3FEND (Model, Harden, Detect, Isolate, Deceive, Evict, Restore).[^5][^7]
- Ось Y: защитные техники.[^7][^5]
- Цвет: число ATT\&CK‑техник, на которые маппится защитная техника (heatmap).[^5][^7]

Интерактивность:

- При клике — подсветка всех ATT\&CK‑техник, на которые она действует, в соседней матрице ATT\&CK.[^7][^5]


### 3. ENGAGE‑панель (вкладка «ENGAGE»)

- Либо отдельная матрица (категории ENGAGE по осям), либо карточки‑плитки, сгруппированные по denial/deception/engagement.[^6][^8]
- Для каждой активности — показывать связанные техники ATT\&CK и защитные техники D3FEND.[^8][^6][^7]

***

## Фильтры и поиск

Главные фильтры сверху панели:

- Домен: Enterprise / Mobile / ICS / OT.[^10][^2][^1]
- Тактики ATT\&CK: мультиселект (Initial Access, Execution и т.п.).[^9][^1]
- Техники ATT\&CK: автокомплит по имени/ID (T1059 и т.п.).[^1][^9]
- Тактики D3FEND: Model, Harden, Detect, Isolate, Deceive, Evict, Restore.[^5][^7]
- Категории ENGAGE: denial, deception, engagement.[^6][^8]
- Интенсивность угроз:
    - Кол-во групп, использующих технику (например, «>= 5 групп»).[^4][^1]
    - Есть ли реальные кампании/пример инцидента (флаг по полю `campaigns` в STIX).[^4][^1]

Поиск по группам злоумышленников:

- Отдельный поиск: имя/алиас группы (APT29, FIN7 и т.п.), с использованием `intrusion-set` из ATT\&CK STIX.[^1][^4]
- После выбора группы вы:
    - Подсвечиваете её техники в матрице ATT\&CK.[^4][^1]
    - Справа показываете блок: «Какие D3FEND‑техники закрывают эти техники?» и «Какие ENGAGE‑активности уместны?».[^8][^7][^5]

***

## Технологический стек (практическое предложение)

### Бэкенд (агрегация данных)

Подход, который вам, как разработчику, будет комфортен:

- Python + FastAPI:
    - Скрипт для загрузки и парсинга STIX из `mitre-attack/attack-stix-data` (v17.1).[^4]
    - Скрипт для загрузки/парсинга D3FEND онтологии (официальный RDF/OWL/JSON‑экспорт с d3fend.mitre.org или от вендоров, описывающих структуру).[^7][^5]
    - Таблица/JSON для ENGAGE (официальный YAML/JSON из MITRE ENGAGE, плюс описания от Exabeam/CounterCraft как reference).[^6][^8]

API‑эндпоинты:

- `/tactics/attack`, `/techniques/attack`, `/groups`, `/d3fend/techniques`, `/engage/activities`.
- `/matrix/attack?v=17.1&domain=enterprise`.
- `/group/{id}/coverage` — возвращает:
    - список техник группы,
    - для каждой — связанные D3FEND/ENGAGE сущности.[^8][^1][^4][^5][^7]


### Фронтенд

- Вариант 1: React + TypeScript + какой‑нибудь charting‑фреймворк (ECharts, Plotly.js, D3).
- Вариант 2 (быстрый прототип): Python + Streamlit/Plotly (heatmap‑матрица + sidebar‑фильтры).

Структура UI:

- Левый сайдбар: фильтры (домен, тактики, группы, категории D3FEND/ENGAGE).
- Центральная область: вкладки:
    - «ATT\&CK Matrix»
    - «D3FEND Matrix»
    - «ENGAGE»
- Правый сайдбар: подробности выбранной техники/группы, список реальных угроз и компенсирующих мер.

***

## Пример минимального прототипа на Python (Streamlit)

Ниже — набросок логики (упрощённый; передачи данных/структур, а не рабочий файл):

```python
import streamlit as st
import pandas as pd
import plotly.express as px

# attack_df: columns = ['tech_id','tech_name','tactic','groups_used','has_real_incident']
# d3fend_df: columns = ['def_id','def_name','tactic','attack_tech_ids']
# mappings: already precomputed

st.sidebar.title("Фильтры")

domain = st.sidebar.selectbox("ATT&CK domain", ["enterprise", "mobile", "ics"])
tactics_filter = st.sidebar.multiselect("ATT&CK тактики", sorted(attack_df['tactic'].unique()))
group_search = st.sidebar.text_input("Группа (APT, FIN и т.п.)")

filtered = attack_df[attack_df['domain'] == domain]
if tactics_filter:
    filtered = filtered[filtered['tactic'].isin(tactics_filter)]

pivot = filtered.pivot_table(
    index="tech_name",
    columns="tactic",
    values="groups_used",
    aggfunc="count",
    fill_value=0
)

fig = px.imshow(
    pivot.values,
    x=pivot.columns,
    y=pivot.index,
    color_continuous_scale="Reds",
    labels=dict(color="Кол-во групп")
)

st.subheader("Матрица MITRE ATT&CK")
st.plotly_chart(fig, use_container_width=True)
```

К этому вы можете добавить:

- клик по ячейке → найти `tech_id`, по нему запросить связанные D3FEND/ENGAGE и вывести справа;
- отдельную вкладку с матрицей D3FEND (ось X — тактика D3FEND, ось Y — защитная техника, значение — число связанных ATT\&CK‑техник).[^5][^7]

***

Если хотите, я могу:

- Разложить подробнее схему БД/JSON‑модели под ваш стек (Postgres, SQLite, даже чистый файлик).
- Сгенерировать конкретный Python‑скрипт, который вытянет v17.1 из `mitre-attack/attack-stix-data`, соберёт таблицы и сохранит вам CSV с матрицей и маппингами ATT\&CK↔D3FEND, чтобы вы сразу подали их в вашу панель.[^2][^3][^4][^7]

<div align="center">⁂</div>

[^1]: https://attack.mitre.org

[^2]: https://attack.mitre.org/docs/attack-excel-files/v17.1/ics-attack/ics-attack-v17.1-tactics.xlsx

[^3]: https://attack.mitre.org/resources/attack-data-and-tools/

[^4]: https://github.com/mitre-attack/attack-stix-data

[^5]: https://bsg.tech/blog/mitre-d3fend/

[^6]: https://www.countercraftsec.com/blog/founder-chat-what-is-mitre-engage-and-how-to-use-it/

[^7]: https://www.vectra.ai/topics/mitre-d3fend

[^8]: https://www.exabeam.com/explainers/mitre-attck/what-is-mitre-engage-formerly-mitre-shield/

[^9]: https://www.wiz.io/academy/detection-and-response/mitre-attack-framework

[^10]: https://attack.mitre.org/resources/updates/

