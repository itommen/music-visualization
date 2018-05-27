import React, { Fragment } from 'react';

import { Flex } from 'reflexbox';
import Typography from 'material-ui/Typography';
import InputRange from 'react-input-range';
import layoutOptions from './../layoutOptions';
import templates from './../templates';

const frameBaseStyle = (selected, value) => ({
    width: '30px',
    height: '30px',
    border: '2px solid',
    borderColor: selected === value ? 'green' : 'black'
});

const frameTypeStyle = (selected, value) => {
    const style = frameBaseStyle(selected, value);
    style.backgroundColor = 'gray';

    return style;
}

const setTemplate = (onUpdate, template) => {
    onUpdate('template', template);
    onUpdate('background', template.background);
    onUpdate('borderRadius', template.borderRadius);
}

const setBackgroundImage = (onUpdate, image) => {
    onUpdate('template', null);
    onUpdate('background', `url(https://localhost:8081/client/App/Images/${image})`);
}

export default ({ setting, onUpdate }) => <Fragment>
  <Flex auto style={{ padding: '30px 0' }}>
    <span>Opacity</span>
    <InputRange
      maxValue={100}
      minValue={0}
      value={setting.opacity * 100}
      onChange={x => onUpdate('opacity', x / 100)} />
  </Flex>
  <Flex auto justify='space-between'>
    <Typography>Frame Type</Typography>
    {
      layoutOptions.frameTypes.map(x => <div key={x} style={{ ...frameTypeStyle(setting.borderRadius, x), borderRadius: x }} onClick={() => onUpdate('borderRadius', x)}></div>)
    }
  </Flex>
  <Flex auto justify='space-between' style={{ paddingTop: '30px' }}>
    <Typography>Background Color</Typography>
    {
      layoutOptions.backgroundColors.map(x => <div key={x} style={{ ...frameBaseStyle(setting.background, x), background: x }} onClick={() => onUpdate('background', x)}></div>)
    }
  </Flex>
    <Flex auto justify='space-between' style={{ paddingTop: '30px' }}>
        <Typography>Background Theme</Typography>
        {
            layoutOptions.backgroundThemes.map(x => <div key={x} style={{ ...frameBaseStyle(setting.background, x), animation: `${x} 10s infinite`}} onClick={() => onUpdate('background', x)}></div>)
        }
    </Flex>
    <Flex auto justify='space-between' style={{ paddingTop: '30px' }}>
        <Typography>Template</Typography>
        {
            templates.templatesList.map(x => <img key={x} src={`https://localhost:8081/client/App/Images/${x.image}`} style={{ ...frameBaseStyle(setting.template, x)}} onClick={() => setTemplate(onUpdate, x)}></img>)
        }
        <div style={{ ...frameBaseStyle(setting.template, null), template: null}} onClick={() => onUpdate('template', null)}></div>
    </Flex>
    <Flex auto justify='space-between' style={{ paddingTop: '30px' }}>
        <Typography>Background Images</Typography>
        {
            templates.backgroundImages.map(x => <img key={x} src={`https://localhost:8081/client/App/Images/${x}`} style={{ ...frameBaseStyle(setting.image, x)}} onClick={() => setBackgroundImage(onUpdate, x)}></img>)
        }
    </Flex>
</Fragment>;