<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# как wifi определяет дистанцию

Wi-Fi определяет дистанцию косвенно, в основном через измерение силы принимаемого сигнала (RSSI). Это значение падает с расстоянием по закону обратных квадратов, но также зависит от помех и препятствий.[^3]

## Основной метод

Сила сигнала (RSSI) уменьшается пропорционально расстоянию из-за потерь в свободном пространстве (FSL), рассчитываемых по формуле $FSL = 20 \log_{10}(D) + 20 \log_{10}(F) + 32.44$, где $D$ — расстояние в км, $F$ — частота в МГц. Устройства сравнивают текущий RSSI с эталонными значениями для оценки дистанции.[^5]

## Дополнительные технологии

Современные стандарты (802.11mc/Fine Time Measurement) используют обмен временными метками между точками доступа для точного измерения времени полёта сигнала (ToF), что даёт расстояние с ошибкой до 1 м. Beamforming в Wi-Fi 6 усиливает сигнал в направлении клиента, помогая уточнить позицию.[^1]

## Факторы влияния

- Препятствия (стены, тела) вызывают затухание до 20 дБ.[^3]
- Частота: 5 ГГц слабее 2,4 ГГц на дистанции.[^6]
- Wi-Fi sensing анализирует фазу и отражения для "видения" сквозь стены.[^2]

Типичная дальность в помещении — 10–50 м, на улице — до 150 м.[^7][^6]
<span style="display:none">[^10][^4][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.kaspersky.ru/blog/wifi-sensing-motion-detection-howto/40097/

[^2]: https://habr.com/ru/articles/936734/

[^3]: https://wifi-solutions.ru/wi-fi/matematicheskij-raschyot-dalnosti-wi-fi-signala/

[^4]: https://www.reddit.com/r/networking/comments/ov24u/how_to_determine_wifi_range/

[^5]: https://naukaru.ru/ru/nauka/article/43280/view

[^6]: https://wifi.kz/articles/radius-wi-fi-routera/

[^7]: https://trytek.ru/blog/poleznye-stati/opredelenie-ploshhadi-oxvata-wi-fi-signala-98

[^8]: https://tp-link.ru/support/glossary-guides/kakova-dalnost-signala-ulichnykh-tochek-dostupa-wi-fi/

[^9]: https://ru.owon-smart.com/news/how-does-wi-fi-location-technology-survive-on-a-crowded-track/

[^10]: https://indoorsnavi.pro/wifi-dlya-vnutrennego-razmeshcheniya/

