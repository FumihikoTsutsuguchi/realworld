import { describe, expect, it } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import ArticleDetailCommentsForm from 'src/components/ArticleDetailCommentsForm.vue'
import fixtures from 'src/utils/test/fixtures'
import { renderOptions, setupMockServer } from 'src/utils/test/test.utils'

describe('# ArticleDetailCommentsForm', () => {
  const server = setupMockServer(
    ['POST', '/articles/*/comments', { comment: { body: 'some texts...' } }],
  )

  it('should display sign in button when user not logged', () => {
    const { container } = render(ArticleDetailCommentsForm, renderOptions({
      initialState: { user: { user: null } },
      props: { articleSlug: fixtures.article.slug },
    }))

    expect(container).toHaveTextContent('add comments on this article')
  })

  it('should display form when user logged', async () => {
    server.use(['GET', '/profiles/*', { profile: fixtures.author }])
    const { getByRole } = render(ArticleDetailCommentsForm, renderOptions({
      initialState: { user: { user: fixtures.user } },
      props: { articleSlug: fixtures.article.slug },
    }))
    await server.waitForRequest('GET', '/profiles/*')

    await fireEvent.update(getByRole('textbox', { name: 'Write comment' }), 'some texts...')
    await fireEvent.click(getByRole('button', { name: 'Submit' }))

    await server.waitForRequest('POST', '/articles/*/comments')
  })
})
