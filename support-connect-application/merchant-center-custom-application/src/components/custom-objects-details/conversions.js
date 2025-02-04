import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export const docToFormValues = (customObject, languages) => {
  return {
    key: customObject?.key ?? '',
    container: customObject?.container ?? '',
    value: LocalizedTextInput.createLocalizedString(
      languages,
      transformLocalizedFieldToLocalizedString(customObject?.value?.name ?? [])
    ),
  };
};

export const formValuesToDoc = (formValues) => {
  return {
    key: formValues.key,
    container: formValues.container,
    value: LocalizedTextInput.omitEmptyTranslations(formValues.value.name),
  };
};
