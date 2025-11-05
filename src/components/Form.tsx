'use client'

import { FormEvent, useState } from 'react'
import styles from './FormInput.module.css'

export type FormData = {
  [key: string]: string
}

type FormInputProps = {
  id: string
  label: string
  type?: 'text' | 'email' | 'password' | 'textarea'
  placeholder?: string
  required?: boolean
  rows?: number
  value: string
  onChange: (value: string) => void
}

export function FormInput({
  id,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  rows,
  value,
  onChange
}: FormInputProps) {
  if (type === 'textarea') {
    return (
      <div className={styles.group}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        <textarea
          id={id}
          className={styles.input}
          placeholder={placeholder}
          required={required}
          rows={rows || 5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className={styles.group}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

type FormProps = {
  fields: Array<{
    id: string
    label: string
    type?: 'text' | 'email' | 'password' | 'textarea'
    placeholder?: string
    required?: boolean
    rows?: number
  }>
  onSubmit: (data: FormData) => void | Promise<void>
  submitLabel?: string
  isLoading?: boolean
}

export function Form({ fields, onSubmit, submitLabel = 'Enviar', isLoading = false }: FormProps) {
  const [formData, setFormData] = useState<FormData>(
    fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      await onSubmit(formData)
      setMessage({ type: 'success', text: 'Formulário enviado com sucesso!' })
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}))
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao enviar o formulário. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {fields.map((field) => (
        <FormInput
          key={field.id}
          {...field}
          value={formData[field.id]}
          onChange={(value) => handleFieldChange(field.id, value)}
        />
      ))}

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting || isLoading ? 'Enviando...' : submitLabel}
      </button>
    </form>
  )
}
