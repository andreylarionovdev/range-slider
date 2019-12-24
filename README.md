[![Build Status](https://travis-ci.com/andreylarionovdev/range-slider.svg?token=JufgzWYbxsHCtadMMzsW&branch=master)](https://travis-ci.com/andreylarionovdev/range-slider)
# jQuery range slider plugin
This repository contains a simple range slider app that implements MVP architecture, written in TypeScript and can be used as jQuery plugin.

## Getting Started
Compiled .js and .css files contains in `dist` folder. Make sure, you include these files in your html page to make plugin working on page. Something like bellow:
```$xslt
<html>
    <head>
        ...
        <link href="range-slider.css" rel="stylesheet"></head>
    </head>
    <body>
        ...
        <script type="text/javascript" src="range-slider.js"></script>
    </body>
</html>
```
### Usage
Call the `.range()` function on any range input in jQuery to make element range-slider instance.
```$xslt
$('input[type="range"]').range();

// or with custom parameters

$('input[type="range"]').range({
    min: 5000,
    max: 15000,
    range: true
});
```
### Plugin parameters
|Parameter | Type | Default | Description |
|----------|------|---------|-------------|
| min | number| 0 |Minimal value. |
| max | number| 100| Maximal value. |
| step | number | 1 | Values changing step. |
| value | number | 0 | Current value. Lowest value of range when `range == true`. |
| value2 | number | null | Highest value of range. Equal to `max`value when `range == true`.|
| range | boolean | false| Whether to allow the user to select a range between two values. |
| vertical | boolean | false | Slider has vertical orientation.|
| showBubble | boolean | false | Every handle has bubble displaying current value.|
| showConfig | boolean | false | Show config form with parameter inputs for demo purposes.|

### Project build
Clone repository:
```$xslt
git clone https://github.com/andreylarionovdev/range-slider.git
```
Go to project directory:
```$xslt
cd range-slider
```
Install dependencies:
```$xslt
npm install
```
To build project: 
```$xslt
npm run build
```
To run tests:
```$xslt
npm test
```

## Architecture description
Модель и представление рассматриваются независимыми друг от друга и взаимодействуют между собой на основании контрактов (интерфейсов) `State` и `SliderViewExtraData`. Экземпляр класса `Observer` в `Model` и `View` представляет собой реализацию паттерна “Observer” и предназначен для коммуникации между моделью и представлением (другими словами, для передачи в параметры метода модели данных из представления и наоборот - метод представления может быть вызван с данными из модели). Методы, при помощи которых происходит коммуникация между слоями приложения, описаны в контрактах `SliderViewObservable` и `SliderModelObservable`, реализованы в классах `Model` и `View` и связываются в `Presenter` с конечным методом из противоположной сущности функцией обратного вызова.

### Model
Здесь хранится состояние приложения (state: State) и реализованы методы для его модификации.

### View
В представлении реализованы методы для отображения состояния приложения в соответствии с контрактом State.

### Presenter
Тут модель и представление связываются, ждут друг от друга сообщений и реагируют на них вызовом соответствующего метода.

### UML diagrams
Class Notation Diagram:
![screen](https://drive.google.com/uc?id=1IBYowPFFcmUmvKadqpgOk_ZLLbegmfdl)

Layers Interaction  Diagram:
![screen](https://drive.google.com/uc?id=1MIIittc54ZfspE7Tyk4Bz08xMnFbzEuD)

## Built With

* [TypeScript](https://www.typescriptlang.org/) - JavaScript that scales.
* [jQuery](https://jquery.com/) - The Write Less, Do More, JavaScript Library.
