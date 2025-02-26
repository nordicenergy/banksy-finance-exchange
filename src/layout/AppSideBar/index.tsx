import React from 'react'
import { Menu } from 'antd'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import routes, { Route } from '../../routes'
import twitterIcon from '../../assets/images/slidebarLink/twitter.png'
import telegramIcon from '../../assets/images/slidebarLink/telegram.png'

const Container = styled.div`
  width: 20.2rem;
  height: calc(100vh - 6.1rem);
  background-color: white;
  position: relative;
`

const CustomizedMenu = styled(Menu)`
  font-weight: 500;

  .ant-menu-item {
    display: flex;
    align-items: center;
    svg {
      width: 1.7rem;
      line {
        shape-rendering: crispEdges;
      }
    }
  }

  .ant-menu-item-selected {
    background-color: #7c6deb !important;

    a {
      color: white !important;
    }

    &:after {
      border-right: none !important;
    }
  }

  .ant-menu-item-active:not(.ant-menu-item-selected) {
    background-color: rgb(229, 226, 251) !important;
  }
`

const CustomizedLink = styled.div`
  width: 100%;
  height: 50px;
  position: absolute;
  bottom: 100px;
  display: flex;
  align-items: center;

  &,
  a {
  margin-left: 1.5rem;
    img {
      width: 3rem;
    }
  }
`

const AppSideBar: React.FC = () => {
  const { pathname } = useLocation()

  const selectedKey: string = (() => {
    return routes.filter(route => route.path === pathname || route.match?.test(pathname))[0].path
  })()

  return (
    <Container>
      <CustomizedMenu selectedKeys={[selectedKey]} mode="inline">
        {
          routes.filter(route => !route.hidden).map((route: Route) => {
            const fillColor = (route.path === pathname || route.match?.test(pathname)) ? 'white' : '#7c6deb'

            return (
              <Menu.Item key={route.path} icon={<route.icon fill={fillColor} />}>
                <Link to={route.path} style={{ userSelect: 'none', color: '#7C6DEB' }}>
                  {route.title}
                </Link>
              </Menu.Item>
            )
          })
        }
      </CustomizedMenu>
      <CustomizedLink>
        <a href={'https://twitter.com/banksy_finance'} rel="noreferrer"  target="_blank"><img src={twitterIcon} /></a>
        <a href={'https://t.me/Banskyfinance'} rel="noreferrer"  target="_blank"><img src={telegramIcon} /></a>
      </CustomizedLink>
    </Container>
  )
}

export default AppSideBar
