<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Применение LC-резонаторов в ТГц метаматериалах

LC-резонаторы в ТГц-метаматериалах используются как базовые элементы для контроля электромагнитного отклика, обеспечивая резонансные эффекты на субволновых масштабах (период < λ/5). Они моделируют LC-контур с индуктивностью от петель и ёмкостью от зазоров, позволяя отрицательную проницаемость μ<0 и усиление локального поля для сенсинга/генерации. Применения включают спектроскопию, фильтры и биосенсоры.[^1][^2][^3]

## Ключевые применения

LC-резонаторы (SRR, электрические LC) в метаплёнках и метаповерхностях настраивают пропускание/отражение в 0,1–10 ТГц путём масштабирования геометрии. Золото даёт выше Q и чувствительность vs алюминий; сдвиги резонанса от аналитов — основа импедансной спектроскопии.[^2][^4]

- **Сенсоры**: Биомолекулы (кортизол) меняют ε_eff в зазоре, вызывая redshift Δf; максимизировано инженерией FP-осцилляций подложки.[^3][^5]
- **Фильтры**: Band-stop на 272 ГГц с coupled SRR и Goubau-линией; tunable MEMS для 200–400 ГГц.[^6]
- **Спектроскопия**: Усиление локализации поля (×2,4) для ТГц-анализа поверхностей/пленок.[^7]


## Характеристики структур

| Тип LC-резонатора | Применение | f_res (ТГц) | Чувствительность [^4] |
| :-- | :-- | :-- | :-- |
| SRR (Au/Al) | Биосенсор кортизола | 0,66–1,87 | Высокая (Au > Al), Q↑ |
| Электрический LC | Импеданс-спектроскопия | 0,1–1,4 | Δf max от ε_eff |
| Coupled SRR | Фильтр/генерация | ~0,27 | Tunable coupling |

Для ваших проектов по embedded (macOS/Linux, ESP32) — LC-мета интегрируют с FPGA для реального времени мониторинга сдвигов в THz-системах спектроскопии тканей.[^5][^1]
<span style="display:none">[^10][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://physics42.ru/tutorials/metamaterialy/elektricheskie-rezonatory-i-ikh-modifikatsii/

[^2]: https://cyberleninka.ru/article/n/harakteristiki-metaplenok-dlya-teragertsovogo-diapazona-chastot-pri-masshtabirovanii-geometricheskih-parametrov

[^3]: https://oasis2022.b2b-wizard.com/expo/posters/12518.pdf

[^4]: https://openbio.ru/new/docs/tezis/2025/openbio_2025_180.pdf

[^5]: https://pubmed.ncbi.nlm.nih.gov/40856099/

[^6]: https://www.bohrium.com/paper-details/tunable-terahertz-band-stop-filter-using-strongly-coupled-split-ring-resonators-integrated-with-on-chip-waveguide/812507204958552065-585

[^7]: https://opticjourn.ru/file_storage/article/full_text/a3dbf3fffaf36cbb1f4b6ab929094c70ea65ec13.pdf

[^8]: https://elc.kpi.ua/old/article/download/306902/304258

[^9]: https://core.ac.uk/download/pdf/287389802.pdf

[^10]: https://pmc.ncbi.nlm.nih.gov/articles/PMC10059862/

