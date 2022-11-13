import { BlitzPage } from '@blitzjs/next'
import { useMutation } from '@blitzjs/rpc'

import forgotPassword from 'src/auth/mutations/forgotPassword'
import { ForgotPassword } from 'src/auth/validations'
import { FORM_ERROR, Form } from 'src/core/components/Form'
import { LabeledTextField } from 'src/core/components/ui/LabeledTextField/LabeledTextField'
import { AppContainer } from 'src/core/components/layout/AppContainer'

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <AppContainer title="パスワードを忘れてしまった場合">
      <h1>Forgot your password?</h1>

      {isSuccess ? (
        <div>
          <h2>Request Submitted</h2>
          <p>If your email is in our system, you will receive instructions to reset your password shortly.</p>
        </div>
      ) : (
        <Form
          submitText="Send Reset Password Instructions"
          schema={ForgotPassword}
          initialValues={{ email: '' }}
          onSubmit={async (values) => {
            try {
              await forgotPasswordMutation(values)
            } catch (error: any) {
              return {
                [FORM_ERROR]: 'Sorry, we had an unexpected error. Please try again.',
              }
            }
          }}
        >
          <LabeledTextField name="email" label="Email" placeholder="Email" />
        </Form>
      )}
    </AppContainer>
  )
}

export default ForgotPasswordPage
