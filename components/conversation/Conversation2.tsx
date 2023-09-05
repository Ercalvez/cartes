'use client'
import { goToQuestion, updateSituation } from '@/actions'
import RuleInput, { RuleInputProps } from 'Components/conversation/RuleInput'
import Notifications from 'Components/Notifications'
import { splitName } from 'Components/utils/publicodesUtils'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, LightButton } from '../UI'
import Aide from './Aide'
import CategoryRespiration from './CategoryRespiration'
import './conversation.css'
import { ExplicableRule } from './Explicable'
import { isMosaic } from './mosaicQuestions'
import SimulationEnding from './SimulationEnding'
import { Fieldset, StepButtons } from './UI'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customEnd?: React.ReactNode
}

const Conversation2 = ({
	currentQuestion,
	customEnd,
	customEndMessages,
	orderByCategories,
	previousAnswers,
	mosaicQuestion,
	rules,
	engine,
	submit,
	situation,
	unfoldedStep,
}) => {
	const dispatch = useDispatch()
	const [dismissedRespirations, dismissRespiration] = useState([])
	const onChange: RuleInputProps['onChange'] = (value) => {
		dispatch(updateSituation(currentQuestion, value))
	}

	const currentQuestionIndex = previousAnswers.findIndex(
			(a) => a === unfoldedStep
		),
		previousQuestion =
			currentQuestionIndex < 0 && previousAnswers.length > 0
				? previousAnswers[previousAnswers.length - 1]
				: previousAnswers[currentQuestionIndex - 1]
	const questionText = mosaicQuestion
		? mosaicQuestion.question
		: rules[currentQuestion]?.rawNode?.question

	if (!currentQuestion)
		return <SimulationEnding {...{ customEnd, customEndMessages }} />

	const questionCategoryName = splitName(currentQuestion)[0],
		questionCategory =
			orderByCategories &&
			orderByCategories.find(
				({ dottedName }) => dottedName === questionCategoryName
			)

	const isCategoryFirstQuestion =
		questionCategory &&
		previousAnswers.find(
			(a) => splitName(a)[0] === questionCategory.dottedName
		) === undefined

	const hasDescription =
		((mosaicQuestion &&
			(mosaicQuestion.description ||
				rules[mosaicQuestion.dottedName].rawNode.description)) ||
			rules[currentQuestion].rawNode.description) != null

	const currentQuestionIsAnswered =
		currentQuestion && isMosaic(currentQuestion)
			? true
			: situation[currentQuestion] != null

	const goToPrevious = () => {
		return dispatch(goToQuestion(previousQuestion))
	}

	return false &&
		orderByCategories &&
		isCategoryFirstQuestion &&
		!dismissedRespirations.includes(questionCategory.dottedName) ? (
		<CategoryRespiration
			questionCategory={questionCategory}
			dismiss={() =>
				dismissRespiration([
					...dismissedRespirations,
					questionCategory.dottedName,
				])
			}
		/>
	) : (
		<section
			className="ui__ container"
			css={`
				@media (max-width: 800px) {
					padding: 0.4rem 0 0.4rem;
				}

				@media (min-width: 800px) {
					margin-top: 0.6rem;
				}
				border-radius: 0.6rem;
			`}
		>
			<div style={{ outline: 'none' }}>
				<div className="step">
					<header css="display: flex; justify-content: start; ">
						<h3
							css={`
								@media (max-width: 800px) {
									margin: 0.4rem 0;
								}
							`}
						>
							{questionText}
						</h3>
						{hasDescription && (
							<ExplicableRule
								dottedName={
									(mosaicQuestion && mosaicQuestion.dottedName) ||
									currentQuestion
								}
							/>
						)}
					</header>
					<Aide rules={rules} />
					<Fieldset>
						<RuleInput
							dottedName={currentQuestion}
							onChange={onChange}
							onSubmit={submit}
							engine={engine}
						/>
					</Fieldset>
				</div>
				<StepButtons>
					{previousAnswers.length > 0 && currentQuestionIndex !== 0 && (
						<>
							<LightButton onClick={goToPrevious}>← Précédent</LightButton>
						</>
					)}
					{currentQuestionIsAnswered ? (
						<Button onClick={() => submit('accept')}>
							<span className="text">Suivant →</span>
						</Button>
					) : null}
				</StepButtons>
				<Notifications currentQuestion={currentQuestion} engine={engine} />
			</div>
		</section>
	)
}

export default Conversation2