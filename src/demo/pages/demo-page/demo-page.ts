import $ from 'jquery';
import '../../../app/ts/jquery.range';

const toCamelCase = (s): string => s.replace(/([-][a-z])/ig, ($1) => $1.toUpperCase().replace('-', ''));

const updateForm = ($form, state): void => {
  const $textInputs = $form.find('.js-slider-config__input_type_text');
  $textInputs.each((_, configInput) => {
    const name: string = toCamelCase($(configInput).attr('name'));
    $(configInput).val(state[name]);
  });
};

const handleConfigInputChange = (event, api) => {
  const propName: string = toCamelCase($(event.target).attr('name'));
  const propValue: number|boolean = $(event.target).hasClass('js-slider-config__input_type_checkbox')
    ? $(event.target).is(':checked')
    : Number($(event.target).val());

  api.update({
    [propName]: propValue,
  });
};

const setEventListeners = ($form, api): void => {
  $form.find('.js-slider-config__input').each((_, input) => {
    $(input).on('change', (event) => handleConfigInputChange(event, api));
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
