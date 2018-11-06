/* @flow */

import Simulateur from 'Components/Simu'
import { ScrollToTop } from 'Components/utils/Scroll'
import { React, Component, T } from 'Components'
import Helmet from 'react-helmet'
import * as Animate from 'Ui/animate'
import type { Match, Location } from 'react-router'

type Props = {
	match: Match,
	location: Location
}
class SocialSecurity extends Component<Props, {}> {
	render() {
		return (
			<>
				<Helmet>
					<title>Social security in France: costs and benefits</title>
					<meta
						name="description"
						content="Discover the costs and benefits of French social security and protection (welfare) by simulating a concrete case of hiring in your company."
					/>
				</Helmet>
				<ScrollToTop />
				<Animate.fromBottom>
					{this.props.match.isExact && (
						<T k="sécu">
							<h1>Protection sociale : coût et avantages</h1>
							<p>
								La France a choisi d'offrir à ses citoyens une protection
								sociale de qualité. Ce système obligatoire repose sur la
								solidarité et vise à assurer le{' '}
								<strong>bien-être général de la population</strong>.
							</p>
							<p>
								L'accès facile aux soins de santé et à d'autres services permet
								aux entreprises d'employer des travailleurs en bonne santé,
								productifs et hautement qualifiés.
							</p>
							<p>
								Dès que vous déclarez et payez vos salariés, vous leur donnez
								automatiquement droit au régime général de la Sécurité sociale
								française (santé, maternité, invalidité, vieillesse, maladie
								professionnelle et accidents) et à l'assurance chômage.
							</p>
							<div
								style={{
									position: 'relative',
									width: '100%',
									height: '0',
									paddingBottom: '56.25%'
								}}>
								<iframe
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%'
									}}
									src="https://www.youtube-nocookie.com/embed/dN9ZVazSmpc?rel=0&amp;showinfo=0"
									frameBorder="0"
									allow="autoplay; encrypted-media"
									allowFullScreen
								/>
							</div>
							<h2>Combien coûte une embauche ?</h2>
						</T>
					)}
					<Simulateur displayHiringProcedures key={location.pathname} />
				</Animate.fromBottom>
			</>
		)
	}
}

export default SocialSecurity
