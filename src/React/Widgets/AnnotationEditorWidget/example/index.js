import AnnotationEditorWidget from '..';
import React                from 'react';
import ReactDOM             from 'react-dom';
import SelectionBuilder from '../../../../Common/Misc/SelectionBuilder';
import AnnotationBuilder from '../../../../Common/Misc/AnnotationBuilder';

import LegendProvider from '../../../../InfoViz/Core/LegendProvider';

// Load CSS
require('normalize.css');

const scores = [
  { name: 'Yes', color: '#00C900', value: 100 },
  { name: 'Maybe', color: '#FFFF00', value: 0 },
  { name: 'No', color: '#C90000', value: -Number.MAX_VALUE },
];

const rangeSelection = SelectionBuilder.range({
  pressure: [
    { interval: [0, 101.3], endpoints: 'oo', uncertainty: 15 },
    { interval: [200, 400], endpoints: '*o', uncertainty: 30 },
  ],
  temperature: [
    { interval: [233, Number.MAX_VALUE], endpoints: 'oo', uncertainty: 15 },
  ],
});

const partitionSelection = SelectionBuilder.partition('pressure', [
  { value: 90, uncertainty: 0 },
  { value: 101.3, uncertainty: 20 },
  { value: 200, uncertainty: 40, closeToLeft: true },
]);

const annotations = [
  AnnotationBuilder.annotation(rangeSelection, [100]),
  AnnotationBuilder.annotation(partitionSelection, [0, 100, 0, -Number.MAX_VALUE]),
  AnnotationBuilder.annotation(SelectionBuilder.convertToRuleSelection(rangeSelection), [0]),
];
const legendService = LegendProvider.newInstance({ legendEntries: ['pressure', 'temperature'] });

// Get react component
document.body.style.padding = '10px';

function render() {
  ReactDOM.render(
    <div>
      {annotations.map((annotation, idx) =>
        <div key={idx}>
          <AnnotationEditorWidget
            scores={scores}
            annotation={annotation}
            getLegend={legendService.getLegend}
            onChange={(newAnnotation, save) => {
              annotations[idx] = newAnnotation;
              if (save) {
                console.log('Push annotation', newAnnotation.generation, newAnnotation);
              }
              render();
            }}
          />
          <hr/>
        </div>
      )}
    </div>,
    document.querySelector('.content'));
}

render();