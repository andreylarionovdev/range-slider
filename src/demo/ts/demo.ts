import $ from 'jquery';
import '../styles/style.scss';
import '../../app/ts/jquery.range';

const updateForm = ($form, state): void => {
  const $textInputs = $form.find('.js-slider-config__input_type_text');
  $textInputs.each((_, configInput) => {
    const name = $(configInput).attr('name');
    $(configInput).val(state[name]);
  });
};

const setEventListeners = ($form, api): void => {
  const toCamelCase = (s) => s.replace(/([-][a-z])/ig, ($1) => $1.toUpperCase().replace('-', ''));
  $form.find('.js-slider-config__input_type_text').each((_, textInput) => {
    $(textInput).on('blur', (event) => {
      const propName = toCamelCase($(event.target).attr('name'));
      const propValue = $(event.target).val();
      api.update({
        [propName]: propValue,
      });
    });
  });
  $form.find('.js-slider-config__input_type_checkbox').each((_, checkbox) => {
    $(checkbox).on('change', (event) => {
      const propName = toCamelCase($(event.target).attr('name'));
      const propValue = $(event.target).is(':checked');
      api.update({
        [propName]: propValue,
      });
    });
  });
};

const init = ($targets): void => {
  $targets.each((_, target) => {
    const $target = $(target);
    const $configForm = $target.closest('.js-slider-group').find('.js-slider-config');

    const sliderApi = $target.range({
      onChange(state) {
        updateForm($configForm, state);
      },
      onCreate(state) {
        updateForm($configForm, state);
      },
    }).data('api');

    setEventListeners($configForm, sliderApi);
  });
};

init($('.js-slider-group__target-input'));
