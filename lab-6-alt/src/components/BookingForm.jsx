import GuestsStepper from './GuestsStepper.jsx'
import { sendBooking } from '../api.js'
import { startTransition, useActionState, useRef } from 'react'
import { bookingSchema } from '../bookingSchema.js'
import { useFormik } from 'formik'

const initialValues = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  comment: '',
}

const fieldOrder = ['name', 'phone', 'date', 'time']

export default function BookingForm() {
  const nameRef = useRef(null)
  const [result, dispatch, isPending] = useActionState(bookTable, null)
  const formik = useFormik({
    initialValues,
    validationSchema: bookingSchema,
    onSubmit: (values) => {
      if (isPending) return
      const booking = bookingSchema.cast(values)
      startTransition(() => dispatch(booking))
    },
  })

  async function bookTable(previousResult, booking) {
    if (booking === null) return null
    const response = await sendBooking(booking)
    if (response.ok) startTransition(() => formik.resetForm())
    return response
  }

  function errorOf(name) {
    return formik.touched[name] ? formik.errors[name] : undefined
  }

  async function handleSubmit(e) {
    const form = e.currentTarget
    formik.handleSubmit(e)
    const errors = await formik.validateForm()
    const firstInvalid = fieldOrder.find((name) => errors[name])
    if (firstInvalid) form.elements[firstInvalid].focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.currentTarget.requestSubmit()
    }
  }

  function handleReset() {
    formik.resetForm()
    nameRef.current.focus()
    startTransition(() => dispatch(null))
  }

  return (
    <form
      className="booking-form"
      noValidate
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <div className="field">
        <label>
          Ім'я
          <input
            {...formik.getFieldProps('name')}
            ref={nameRef}
            autoComplete="name"
            required
            aria-invalid={errorOf('name') ? 'true' : 'false'}
            aria-describedby="name-error"
          />
        </label>
        <p id="name-error" className="field-error">
          {errorOf('name')}
        </p>
      </div>
      <div className="field">
        <label>
          Телефон
          <input
            type="tel"
            {...formik.getFieldProps('phone')}
            autoComplete="tel"
            placeholder="+380671234567"
            required
            aria-invalid={errorOf('phone') ? 'true' : 'false'}
            aria-describedby="phone-error"
          />
        </label>
        <p id="phone-error" className="field-error">
          {errorOf('phone')}
        </p>
      </div>
      <div className="row">
        <div className="field">
          <label>
            Дата
            <input
              type="date"
              {...formik.getFieldProps('date')}
              required
              aria-invalid={errorOf('date') ? 'true' : 'false'}
              aria-describedby="date-error"
            />
          </label>
          <p id="date-error" className="field-error">
            {errorOf('date')}
          </p>
        </div>
        <div className="field">
          <label>
            Час
            <input
              type="time"
              {...formik.getFieldProps('time')}
              required
              aria-invalid={errorOf('time') ? 'true' : 'false'}
              aria-describedby="time-error"
            />
          </label>
          <p id="time-error" className="field-error">
            {errorOf('time')}
          </p>
        </div>
      </div>
      <GuestsStepper
        value={formik.values.guests}
        onChange={(guests) => formik.setFieldValue('guests', guests)}
      />
      <label>
        Коментар
        <textarea
          {...formik.getFieldProps('comment')}
          maxLength={200}
          aria-describedby="comment-counter"
        />
      </label>
      <p id="comment-counter" className="counter">
        {formik.values.comment.length} / 200
      </p>
      <div className="actions">
        <button type="submit" aria-disabled={isPending}>
          {isPending ? 'Надсилаємо…' : 'Забронювати'}
        </button>
        <button type="button" onClick={handleReset}>
          Очистити
        </button>
      </div>
      <p
        role="status"
        className={result?.ok === false ? 'status error' : 'status'}
      >
        {result?.message}
      </p>
    </form>
  )
}
