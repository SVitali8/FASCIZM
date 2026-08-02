<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# LC-резонанс

LC-резонанс (индуктивно-ёмкостный резонанс) — это фундаментальный эффект в метаматериалах для ТГц-диапазона, моделируемый как колебательный контур LC, где индуктивность L от петель тока и ёмкость C от зазоров в резонаторах. Он определяет резонансную частоту f = 1/(2π√(LC)), обеспечивая высокую добротность Q и локализацию поля для генерации/сенсинга ТГц-излучения.[^1][^5]

## Принцип работы

В структурах вроде split-ring resonators (SRR) или П-образных резонаторов LC-резонанс возбуждается ТГц-полем, создавая циркулирующие токи и магнитный отклик. При масштабировании геометрии (период < λ/5–7) возникает отрицательная проницаемость μ<0, что усиливает нелинейные эффекты для генерации широкополосного излучения (0,1–4 ТГц).[^4][^1]

Ширина резонанса ~10–30 ГГц, с минимумами пропускания/отражения на f_res; взаимодействие с плазмонами даёт экстраординарное пропускание.[^5]

## Применение в ТГц

- **Генерация**: В метаповерхностях LC-резонаторы усиливают оптическое выпрямление при лазерной накачке.[^10]
- **Спектроскопия тканей**: Сенсоры на SRR (0,66–1,87 ТГц) детектируют сдвиги резонанса от биомолекул (кортизол), с чувствительностью по поглощению/фазе.[^6]
- **Фильтры**: Частотно-селективные поверхности с LC для ТГц-TDS.

| Параметр | Значение | Пример структуры [^6] |
| :-- | :-- | :-- |
| f_res | 0,66–1,87 ТГц | SRR на Si с Au/Al |
| Q-фактор | Высокий (золото > алюминий) | Сенсор кортизола |
| Полоса | 10–30 ГГц | П-резонаторы |

Для embedded-применений (ESP32/RISC-V) LC-метаматериалы интегрируют в чипы с контролем сдвигов резонанса для портативной THz-спектроскопии тканей.[^4]
<span style="display:none">[^2][^3][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://cyberleninka.ru/article/n/harakteristiki-metaplenok-dlya-teragertsovogo-diapazona-chastot-pri-masshtabirovanii-geometricheskih-parametrov

[^2]: https://core.ac.uk/download/pdf/287389802.pdf

[^3]: https://www.tydexoptics.com/ru/filemanager/download/24388

[^4]: http://www.issp.ac.ru/ebooks/disser/gayduk_a_e.pdf

[^5]: https://opticjourn.ru/file_storage/article/full_text/a3dbf3fffaf36cbb1f4b6ab929094c70ea65ec13.pdf

[^6]: https://openbio.ru/new/docs/tezis/2025/openbio_2025_180.pdf

[^7]: https://new.ras.ru/upload/iblock/643/wrrrvkj4hxqiimd2wk9h1616wu7kdp10.pdf

[^8]: https://www.ioffe.ru/serve/theses/avtoref/Thes_0480.pdf

[^9]: http://www.issp.ac.ru/ebooks/disser/Esaulkov_M_N.pdf

[^10]: https://priority2030.mephi.ru/node/374

