import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Landing from '../Landing.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(Landing, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
