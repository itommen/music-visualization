import React, { Component } from 'react';

import { Flex } from 'reflexbox';

import Stepper, { Step, StepLabel } from 'material-ui/Stepper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import MicIcon from 'material-ui-icons/Mic';
import CameraIcon from 'material-ui-icons/Camera';
import PopIcon from 'material-ui-icons/Favorite';

import MenuItem from './MenuItem';

const envirements = [{
  title: 'live',
  icon: <CameraIcon />,
  setting: {
    opacity: 0.2,
    barsVisiable: true,
    borderRadius: '0 20%'
  }
},
{
  title: 'karioki',
  icon: <MicIcon />,
  setting: {
    opacity: 0.7,
    barsVisiable: false,
    borderRadius: '100%'    
  }
}];

const genres = [{
  title: 'pop',
  icon: <img src="data:image/png;base64,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" />,
  setting: {
  }
},
{
  title: 'rock',
  icon: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAQjSURBVGhD7ZlZqFVVGMevijkgEqZEDiiVOTSoOD4UhEZFBBqkD1LqQ0URigM44PCgIlpaCdocRZBD9aCGmiP4oG/iiOCDiPOsEWTaoP5++54Fq+05133lnnv2ifuHH/euffY56/vvvdba3/p2TZOa1CDqA53graRVJeoOneEDeB3Ww0cwCr6HFlAVmgxvw8zC389hO1yB27AV2kKu1QYWQwi6FAsht/Iqe7UN9BYcgVXgnXkZvgE/uwnDIZfSxBYw0JMwDNQD0AuWQzDxKuRSDqdg4hQ8Bh1gNVwHj8ufkGsTv0JswmX2YOGYRo7BD/Ak5FKtITbxOMQm9kFHyLU0sRkM+DT0hLSJhyDXagX/CxObwIDPwBNQdSZcSmMTLqtVaWIjGPBZqHoT56A3VKWJXyB3JrrCUjgMV8GH1dfQF9KKTZyHsKeouImX4BoYRJq/YAIEacJ9hJ9pQqO5MNEP/gCDWAMmdT51B4Ppg8dN6GzHJi5AMHGgcKyic2IHGMQXSetuLQE/18C6wv8XwfwoNyYeBYP4Ddp5oIjag+cEcmdCjQUD+TlpFZdP7NjEU5ArEyqM96lJ625ZDPgRgolnoKIm3Bs8B+/DbHDch7lxCaxspJUrEw+DpZfLYOdpTCmeh7RiExp1ZauYiREQVyz2wkqYUeBNKDbBm8FaCCb6Q8VMDIGwJ94JXtGs8i5a6fC780ETFXnYPQJuL+3YO5C1euedCJoCfl9DJwr/ixflFXihwFAom8yP7NSdWlYTH4LfK2ZG9kO4OGlmQYPLXdnfYHmlmwcyaBD8Awb1JcRm3gHTFIeTK9sisKiwDTTndyy8Nbjmgj/+WdLKrvEQzFiPjc2U0gq4n74yaQ/44y8mrfopNvMplDJjWmNe5vzx/IHQ4HKDYyB1rSzOG0v47yWt/yqYMfcy4FgDYAP8C/bh8PX8sugG2EnzpFVcIb/yir7rgZTeAOdNrIng3PN79vEduDcvm9wj2Nm9qnjuBOsyE8s74V3y3GXgc6Xs2g0GaF51L/mmKIuZT8DzrJo3msyr7NTOs+hj8HyfEaX2IyG59D1Go8kM1U4dYqUCi+XKNA8sbZbScfA305O/7NoFduzT+n7k3rxL7b81D4JDz1WsrgWkLDJBdIWx+lHf11guEk5s55oaB14Ui3AVkVmrAXgliw0bH2K+swjyLvQAh5ppyGhwM2aNy98ZCRWRAf0EBmH2+jQE+f7C8s6hpFVbXPAOul+J9S34fc00+rCK5UtI32EbzO/wGgSZsfrgU5qeA2OSVm2xIZiw3lWWFKS+aglfgUGJY90dXym5xLp5CuYbdcnNIkuebluDIYeL2at7jungBsxab/j8KMTDMVdyKXUi+0osBJzGB+M0sDSaezlxnwXTEjOBBTAJTBRLpe5Nqr9qau4AYz5ndFyp3/EAAAAASUVORK5CYII=" />,
  setting: {
  }
},
{
  title: 'party',
  icon: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPmSURBVGhD7dhbqBZVGMbxXVlGVpohVBeCClFk5SExI0JT0ULpoEIIgaCiFxEoBRFqF2kXJelNSBhEFIiHDh7QIqIgItEiooSINBBEUgyjlMo8/J+hNXyz9jNrhuHbMMj3wO9iwzt75ptZ75o1q6+XXnrppZdeerlMMxg31XQlWpnn8C8u1nQSM9GqXIdzcBecchCtytU4DXexKZ+hdZmFb3C4pn0Yg1ZmGEbXpKfYyqzBebgh5PyJR9GqqNn/g7vglG/RqgzCKbiLTfkErctUfAHX2LFf8AFGopW5FRNrGA8Nx4HIFbgd7ryxu3AVClkHN3zK/IN56Ga0RPoK7nxljiJ/DQzBBbjClO/QzcyFO0+VV5FFj+cEXFHKHnQz96HJDV2BPPdDb2u93et4D+qpbmcpvoQ7Z2w/XkG/PhkF11SOlvIDEV3UWLhzxu6F+qqQ1+EeWxm9QBeim7kWB+DOV+Y33IEsTZv9e3Qzj8Odp8p6ZNHX3nG4opSd6GbGockNfQZ5JuB9fFrTmxiBbkfDdS/cOWNaIq1Gv2ZXk82oYTrcjKUnqyZ0x8SmwU0Y12AK3DGxh3A9CtkE99jKaAgsQoh+hO6Qqy3zN3RBIepV9Z2rLaPFrpYqWfSrXFGVzma/B66myocIeQKupopm3Cy6m1qzuKKUHQgZjr/g6lJeQ8jdaPJdtAx59HjehWsqZyPiMf4gtsHVxz7Gy1BPdGY+9JTcMTFNCiuhFXMe/TEJcUOV0Xd7HH3H121UTRi3IY4+D9TE7piYJoybUcg7cI+tjJp9OUI0BX4OV1tGnwKd3/034Ce42jLaxtL3URb9A1dU5QeEaN3jaqrsQsiTcDVVNiCLhtWvcEUpWxCifvkDri5lLUK0ZmrS7IuRR5+XelurWevQ8vlGdGYy3oarj23FC4j3xx6BJh13TEw3snN4Z9EUrA2IBTXlL6GOaEmtHUtXH9NnspswdHPmwB0T0yLzFhSyHe6xpTyLEG0pfQ1XV0bD6DGEaKfzCFxtmTPQbJulabP/iBCtXF1Nlc5m11NyNVUKzf4zXFGKxnLIUPwOV5fyEkLUp5qSXV3K08ijz1z9MtdUMTXqKsR7W1pvafHpjompUTU04yX4w9gMd0xMN7LwIxSN8dlwTeVohoqj1WvdRpU7EUdrNi0eXX1MQ1EPoJCP4B5byvMI0TSqfS5XV0a7/7qgEP2IY3C1Zc7iAWTRlOeKqhxCSNM3+26ENG12LWDz6KJcUcpbCNHM12ST70WEaOtTH1uuLuUp5NFKVMsFvd3r0O5evKekMa/vC1cf06SwBIUlONFGoe6wOyb2Bv7ff+7ruwQPVqCMH1b96wAAAABJRU5ErkJggg==" />,
  setting: {
  }
},
{
  title: 'chill',
  icon: <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANhSURBVGhD7ZpZqE1RHMa3eUiEkilzKZnKgweKDOFFPHiRN5I5eaF4Uogyy5giw4NEpCSZE4UMkRQZXowhZA7fb7n/e/dZZ9c9O3vvc7bOV7/cb//33Wt91t7nrLX2DarKgRqIiWKfeCy+it8l8F08FHvEKFFW9RdXRVRH43JO9BSZa7z4IOjEUzFf9BZNRClqJQaLFeK14DpvxBCRmRiJ94LGd4qm4l/UTpwWXO+l6CxSF8/EFWEhklJjcVZw3UMcSFsTBI1xOzXnQILqIbhdf4mBHEhTfMoQZKFzyYtnhusfcS5FPRA01Ne55MXzksmofBYEaeZcOspkVGgA0lR4VAZxIA1lEQSlPipZBUl9VLIKgmxULoiGHEhSWQZhVJi20N5SDiSpLIOgyYLbizY3i8S+hLMOgqaLH4J2mWCuFCwd+oleEbQR9aocQdBQcV1Y+/XxVuwXI0Sk7MRyiAkrHVsvzou74lEEr0Q41GHRVhSonEHiqJtYIhgZ+svUqouoVV6CmDoKW8Xyb+3UKm9BEA//fUG/F3EA5TEIGinoN596bjme1yDohqDvozF5DrJK0PfFmDwHmSfo+wZMnoPMFvR9K6YapAJUDVJp+r+DjMkhG0VRkDxTEITd8yis/kXwzsP8R+Gfe0lY/Z2wzfEozxzJ//1rwurPxU3P++fbxLGkZ8TqzP9ZX5u/I3zx+sDqF0X3kD8pWMqaPy58DRNW3ytYdJl3nfUU62H/JKjfdq7u/MvOFYrptdVPiA4hf1SwODJ/QPgaIKxO51gOm18nfMUKYts33DbIXgidca5QjYRdj+Vo65Cn4+1Dfpfw1UdYfY0IB2NPzFesILw3oX7KuSB4IfD8j0fpm6DORgGy628XvJ4zz1aQr67C6ssF7yDNs8z1FSvIPUH9mHNB8ETgDzpXLBsxd3HJdvvdDFXiZ2AK7it8a9LxTiG/QPiKFcQWL3ZP85DjdztXrGeC+lrn6jYLrOP2zC1zrlCs9KjBXBEONlP4ihWEIeYd4CzngmC1wM9wrlhbBPWpzv1tBM8OI+INGX6Sc8WiBmMF+8PmhwtfsYJUsgqC/Kwxie+OZ6A5gr5zFwS3aswmMSVHTBP2zU+gYJywj8w8wodPC+HEFw9fODtyxDbBn5m0FFVVmILgD1joIKQ7QrIYAAAAAElFTkSuQmCC" />,
  setting: {
  }
}];

export default class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      activeState: 0
    };

    this.next = this.next.bind(this);
    this.finish = this.finish.bind(this);
  }

  next(params) {
    this.setState(state => ({
      ...state,
      ...params
    }));
  }

  finish(params) {
    const { onFinish } = this.props;

    const finalSetting = {
      ...this.state,
      ...params
    };

    delete finalSetting.activeState;

    onFinish(finalSetting);
  }

  render() {
    const { activeState } = this.state;

    return <Flex auto justify='center'
      wrap
      align='center'
      style={{ backgroundColor: '#4a4545' }}>
      <Flex column align='center'>
        {
          activeState === 0
            ? <Flex justify='space-around'>
              {
                envirements.map(x => <MenuItem data={x} key={x.title} onNext={this.next} />)
              }
            </Flex>
            : null
        }
        {
          activeState === 1
            ? <Flex justify='space-around' wrap style={{
              width: '50%'
            }}>
              {
                genres.map(x => <MenuItem data={x} key={x.title} onNext={this.finish} />)
              }
            </Flex>
            : null
        }
      </Flex>
    </Flex>;
  }
}