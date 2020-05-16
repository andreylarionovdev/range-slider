import $ from 'jquery';
import '../styles/style.scss';
import '../../app/ts/jquery.range';

$('.js-slider-group__target-input').each((_, input) => {
  const $input = $(input);
  const $configForm = $input.closest('.js-slider-group').find('.js-slider-config');

  const updateForm = ($form, state): void => {
    const $inputs = $form.find('.js-slider-config__input_type_text');
    $inputs.each((__, configInput) => {
      const name = $(configInput).attr('name');
      $(configInput).val(state[name]);
    });
  };

  $input.range({
    onChange(state) {
      updateForm($configForm, state);
    },
    onCreate(state) {
      updateForm($configForm, state);
    },
  });
});
