/* eslint-disable */
import '@testing-library/jest-dom';
import testingLibrary from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import run from '../src/validator.js';

const { screen } = testingLibrary;

let elements;

beforeEach(() => {
  document.body.innerHTML = `
    <div class="form-container"></div>
  `;
  run();

  elements = {
    submit: screen.getByRole('button', { name: /submit/i }),
    loginInput: screen.getByLabelText(/login/i),
    passwordInput: screen.getByLabelText(/password/i),
  };
});

test('форма отрисовывается корректно', () => {
  const form = document.querySelector('form#authForm');
  expect(form).toBeInTheDocument();
  expect(elements.loginInput).toBeInTheDocument();
  expect(elements.passwordInput).toBeInTheDocument();
  expect(elements.submit).toBeInTheDocument();
});

test('валидация поля логина', async () => {
  await userEvent.clear(elements.loginInput);
  await userEvent.type(elements.loginInput, 'ab');
  expect(elements.loginInput).toHaveClass('is-invalid');

  await userEvent.clear(elements.loginInput);
  await userEvent.type(elements.loginInput, 'a'.repeat(21));
  expect(elements.loginInput).toHaveClass('is-invalid');

  await userEvent.clear(elements.loginInput);
  await userEvent.type(elements.loginInput, 'validLogin');
  expect(elements.loginInput).toHaveClass('is-valid');
});

test('валидация поля пароля', async () => {
  await userEvent.clear(elements.passwordInput);
  await userEvent.type(elements.passwordInput, 'pass');
  expect(elements.passwordInput).toHaveClass('is-invalid');

  await userEvent.clear(elements.passwordInput);
  await userEvent.type(elements.passwordInput, 'password');
  expect(elements.passwordInput).toHaveClass('is-invalid');

  await userEvent.clear(elements.passwordInput);
  await userEvent.type(elements.passwordInput, 'Password1');
  expect(elements.passwordInput).toHaveClass('is-invalid');

  await userEvent.clear(elements.passwordInput);
  await userEvent.type(elements.passwordInput, 'Password12');
  expect(elements.passwordInput).toHaveClass('is-valid');

  await userEvent.clear(elements.passwordInput);
  await userEvent.type(elements.passwordInput, 'Password12'.repeat(3));
  expect(elements.passwordInput).toHaveClass('is-invalid');
});

test('кнопка отправки доступна только при валидных данных', async () => {
  await userEvent.clear(elements.loginInput);
  await userEvent.clear(elements.passwordInput);
  await userEvent.type(elements.loginInput, 'user');
  await userEvent.type(elements.passwordInput, 'pass');
  expect(elements.submit).toBeDisabled();

  await userEvent.clear(elements.loginInput);
  await userEvent.type(elements.loginInput, 'a');
  await userEvent.clear(elements.passwordInput);
  await userEvent.type(elements.passwordInput, 'Password12');
  expect(elements.submit).toBeDisabled();

  await userEvent.clear(elements.loginInput);
  await userEvent.type(elements.loginInput, 'validLogin');
  await userEvent.clear(elements.passwordInput);
  await userEvent.type(elements.passwordInput, 'Password12');
  expect(elements.submit).not.toBeDisabled();
});
