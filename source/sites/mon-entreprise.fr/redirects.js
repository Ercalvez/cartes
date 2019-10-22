import React from 'react';
import { Redirect } from 'react-router-dom';
import netlifyToml from '../../../netlify.toml';

export default netlifyToml.redirects
    .filter(({ from, status }) => status === 301 && !from.startsWith('https'))
    .map(x => console.log(x) || x)
    .map(({ from, to }) =>
        <Redirect key={from} from={decodeURIComponent(from)} to={decodeURIComponent(to.replace(':splat', '*'))} exact />
    )        