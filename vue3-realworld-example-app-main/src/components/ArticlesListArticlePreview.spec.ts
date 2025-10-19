import { describe, it } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import ArticlesListArticlePreview from 'src/components/ArticlesListArticlePreview.vue'
import fixtures from 'src/utils/test/fixtures'
import { renderOptions, setupMockServer } from 'src/utils/test/test.utils'

const favoriteButton = 'Favorite article'

describe('# ArticlesListArticlePreview', () => {
  const server = setupMockServer()

  it('should call favorite method when click favorite button', async () => {
    server.use(['POST', '/articles/*/favorite', { article: { ...fixtures.article, favorited: true } }])
    const { getByRole } = render(ArticlesListArticlePreview, renderOptions({
      props: { article: fixtures.article },
    }))

    await fireEvent.click(getByRole('button', { name: favoriteButton }))

    await server.waitForRequest('POST', '/articles/*/favorite')
  })
})
