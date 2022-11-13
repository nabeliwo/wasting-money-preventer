import { BlitzPage, Routes } from '@blitzjs/next'
import { useMutation } from '@blitzjs/rpc'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import resetPassword from 'src/auth/mutations/resetPassword'
import { ResetPassword } from 'src/auth/validations'
import { FORM_ERROR, Form } from 'src/core/components/Form'
import { LabeledTextField } from 'src/core/components/ui/LabeledTextField/LabeledTextField'
import { AppContainer } from 'src/core/components/layout/AppContainer'

const ResetPasswordPage: BlitzPage = () => {
  const [token, setToken] = useState('')
  const router = useRouter()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  useEffect(() => {
    setToken(router.query.token as string)
  }, [router.isReady])

  return (
    <div>
      <h1>Set a New Password</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href={Routes.Home()}>homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword}
          initialValues={{
            password: '',
            passwordConfirmation: '',
            token,
          }}
          onSubmit={async (values) => {
            try {
              await resetPasswordMutation({ ...values, token })
            } catch (error: any) {
              if (error.name === 'ResetPasswordError') {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: 'Sorry, we had an unexpected error. Please try again.',
                }
              }
            }
          }}
        >
          <LabeledTextField name="password" label="New Password" type="password" />
          <LabeledTextField name="passwordConfirmation" label="Confirm New Password" type="password" />
        </Form>
      )}
    </div>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = '/'
ResetPasswordPage.getLayout = (page) => <AppContainer title="パスワードリセット">{page}</AppContainer>

export default ResetPasswordPage
